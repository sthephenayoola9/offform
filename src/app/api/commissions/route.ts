import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to request a commission." }, { status: 401 });
    }

    const { designerId, title, specifications, budget } = await request.json();

    if (!designerId || !title || !specifications) {
      return NextResponse.json(
        { error: "Designer, title, and detailed specifications are required." },
        { status: 400 }
      );
    }

    const commission = await prisma.commissionRequest.create({
      data: {
        buyerId: user.id,
        designerId,
        title: title.trim(),
        specifications: specifications.trim(),
        budget: budget ? parseFloat(budget) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, commission });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
