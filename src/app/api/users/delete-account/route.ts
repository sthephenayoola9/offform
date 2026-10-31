import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { confirmation } = await request.json();
    if (confirmation !== "DELETE MY OFFFORM ACCOUNT") {
      return NextResponse.json(
        { error: "Confirmation phrase does not match. Please verify your intent." },
        { status: 400 }
      );
    }

    // Process deactivation per Section 25
    await prisma.$transaction(async (tx) => {
      // 1. Record Audit Log entry for compliance verification
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "ACCOUNT_DEACTIVATION_REQUESTED",
          targetType: "USER",
          targetId: user.id,
          details: JSON.stringify({
            username: user.username,
            reason: "User initiated account deletion flow",
            retentionSchedule: "Financial records and order histories retained for tax & consumer protection compliance per statutory periods.",
          }),
        },
      });

      // 2. Anonymize personal identifier and bio
      await tx.user.update({
        where: { id: user.id },
        data: {
          displayName: "[Deactivated Creator]",
          bio: "[Account deactivated upon member request. Active sessions terminated.]",
          location: null,
          role: "MEMBER",
          isApprovedSeller: false,
          isVerifiedDesigner: false,
        },
      });
    });

    // Invalidate session cookie
    const cookieStore = cookies();
    cookieStore.set("offform_user_email", "visitor", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      message:
        "Your account has been deactivated. Per Section 25, public identity has been anonymized, and necessary financial/order compliance records will follow statutory retention schedules.",
    });
  } catch (err: any) {
    console.error("Account deletion error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

