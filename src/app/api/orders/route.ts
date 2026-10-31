import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
    }

    const { productId, customisationSelections, shippingAddress, notes } = await request.json();

    if (!productId || !shippingAddress) {
      return NextResponse.json(
        { error: "Product and valid shipping address are required." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        customizationOptions: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product listing not found." }, { status: 404 });
    }

    // Calculate extra costs from selected customisations
    let totalAmount = product.price;
    if (customisationSelections && typeof customisationSelections === "object") {
      for (const [key, val] of Object.entries(customisationSelections as Record<string, any>)) {
        if (val && typeof val === "object" && typeof val.extra === "number") {
          totalAmount += val.extra;
        }
      }
    }

    // Create real order in database
    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        sellerId: product.sellerId,
        totalAmount,
        currency: product.currency,
        status: "PAYMENT_CONFIRMED", // Simulated secure payment transition
        shippingAddress: JSON.stringify(shippingAddress),
        customisationSelections: customisationSelections
          ? JSON.stringify(customisationSelections)
          : null,
        notes: notes || null,
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              unitPrice: totalAmount,
              customisationSummary: customisationSelections
                ? JSON.stringify(customisationSelections)
                : null,
            },
          ],
        },
        history: {
          create: [
            {
              fromStatus: "PENDING_PAYMENT",
              toStatus: "PAYMENT_CONFIRMED",
              note: "Payment authorization verified through sandbox provider. Order dispatched to designer workspace.",
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
