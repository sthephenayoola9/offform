import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface RouteProps {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { status, note, trackingNumber } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only seller of the order or admin can update fulfillment status
    if (order.sellerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Not your seller order." }, { status: 403 });
    }

    const validStatuses = [
      "PAYMENT_CONFIRMED",
      "IN_PRODUCTION",
      "READY_TO_SHIP",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: params.id },
        data: {
          status,
          trackingNumber: trackingNumber || order.trackingNumber,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: status,
          note: note || `Status updated to ${status} by seller`,
        },
      });

      return ord;
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

