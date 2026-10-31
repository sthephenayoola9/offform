import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to submit a proposal." }, { status: 401 });
    }

    const { message, quoteAmount, estimatedDays } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Proposal message is required." }, { status: 400 });
    }

    const proposal = await prisma.collaborationProposal.create({
      data: {
        briefId: params.id,
        designerId: user.id,
        message: message.trim(),
        quoteAmount: quoteAmount ? parseFloat(quoteAmount) : null,
        estimatedDays: estimatedDays ? parseInt(estimatedDays) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, proposal });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
