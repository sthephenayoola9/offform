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

    const { action, notes } = await request.json(); // "DISMISS" | "WARNING" | "PAUSE_LISTING" | "ENFORCE"
    if (!["DISMISS", "WARNING", "PAUSE_LISTING", "ENFORCE"].includes(action)) {
      return NextResponse.json({ error: "Invalid moderation action" }, { status: 400 });
    }

    const report = await prisma.moderationReport.findUnique({
      where: { id: params.id },
      include: { reporter: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const statusMap: Record<string, { status: string; action: string }> = {
      DISMISS: { status: "DISMISSED", action: "NO_ACTION" },
      WARNING: { status: "ENFORCED", action: "WARNING" },
      PAUSE_LISTING: { status: "ENFORCED", action: "PAUSED_LISTING" },
      ENFORCE: { status: "ENFORCED", action: "SUSPENDED_ACCOUNT" },
    };

    const outcome = statusMap[action];

    await prisma.$transaction(async (tx) => {
      // 1. Update the report
      await tx.moderationReport.update({
        where: { id: params.id },
        data: {
          status: outcome.status,
          resolutionAction: outcome.action,
          moderatorNotes: notes || null,
          resolvedAt: new Date(),
        },
      });

      // 2. If target is a product and action is PAUSE_LISTING, pause product status
      if (report.targetType === "PRODUCT" && outcome.action === "PAUSED_LISTING") {
        await tx.product.update({
          where: { id: report.targetId },
          data: { status: "PAUSED" },
        }).catch(() => {});
      }

      // 3. Write AuditLog entry
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: `REPORT_${outcome.status}_${outcome.action}`,
          targetType: "REPORT",
          targetId: report.id,
          details: JSON.stringify({
            reporterUsername: report.reporter.username,
            category: report.category,
            targetType: report.targetType,
            targetId: report.targetId,
            notes: notes || "",
          }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      status: outcome.status,
      resolutionAction: outcome.action,
    });
  } catch (err: any) {
    console.error("Admin moderation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

