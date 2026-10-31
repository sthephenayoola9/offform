import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetType, targetId, category, reason } = await request.json();

    if (!targetId || !category || !reason) {
      return NextResponse.json(
        { error: "Target, violation category, and explanation are required." },
        { status: 400 }
      );
    }

    const report = await prisma.moderationReport.create({
      data: {
        reporterId: user.id,
        targetType: targetType || "POST",
        targetId,
        category,
        reason: reason.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
