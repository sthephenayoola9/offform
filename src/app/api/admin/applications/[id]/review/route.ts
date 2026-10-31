import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface RouteProps {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteProps) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { decision, notes } = await request.json(); // "APPROVE" | "REJECT" | "REQUEST_INFO"
    if (!["APPROVE", "REJECT", "REQUEST_INFO"].includes(decision)) {
      return NextResponse.json({ error: "Invalid review decision" }, { status: 400 });
    }

    const application = await prisma.sellerApplication.findUnique({
      where: { id: params.id },
      include: { applicant: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const statusMap: Record<string, string> = {
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
      REQUEST_INFO: "INFO_REQUESTED",
    };

    const nextStatus = statusMap[decision];

    // Transaction for atomic update and audit logging
    await prisma.$transaction(async (tx) => {
      // 1. Update application status
      await tx.sellerApplication.update({
        where: { id: params.id },
        data: {
          status: nextStatus,
          reviewNotes: notes || null,
          reviewedAt: new Date(),
          reviewedBy: user.id,
        },
      });

      // 2. If approved, promote user role and flags
      if (decision === "APPROVE") {
        await tx.user.update({
          where: { id: application.applicantId },
          data: {
            role: "SELLER",
            isApprovedSeller: true,
            isVerifiedDesigner: true,
          },
        });
      }

      // 3. Create AuditLog entry
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: `SELLER_APPLICATION_${nextStatus}`,
          targetType: "APPLICATION",
          targetId: application.id,
          details: JSON.stringify({
            applicantId: application.applicantId,
            applicantUsername: application.applicant.username,
            businessName: application.businessName,
            notes: notes || "",
          }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      status: nextStatus,
    });
  } catch (err: any) {
    console.error("Admin review error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

