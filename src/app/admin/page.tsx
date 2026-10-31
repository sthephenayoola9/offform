import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Shield, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { AdminConsoleClient } from "@/components/AdminConsoleClient";

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#FBECEE] text-[#A92735] rounded-3xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="font-editorial text-4xl text-[#252321]">
          Restricted Administrative Console
        </h1>
        <p className="text-sm text-[#77716D] leading-relaxed max-w-md mx-auto">
          Access to seller verification queues, moderation evidence, and platform audit logs is
          restricted to authorised OFFFORM administrators and moderators.
        </p>
        <div className="p-4 bg-white border border-[#E7E1DB] rounded-2xl text-xs text-[#77716D] max-w-md mx-auto space-y-2">
          <p className="font-semibold text-[#252321] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A92735]" /> Demo Environment Tip
          </p>
          <p>
            You can test the entire admin workflow right now by clicking <strong>"Admin"</strong> on the
            black Demo Role Switcher bar at the top of your screen!
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="px-6 py-3 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
          >
            Return to Homepage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Fetch admin dashboard queues
  const [
    applications,
    reports,
    auditLogs,
    totalUsers,
    totalProducts,
    pendingApplicationsCount,
    pendingReportsCount,
  ] = await Promise.all([
    prisma.sellerApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { applicant: true },
    }),
    prisma.moderationReport.findMany({
      orderBy: { createdAt: "desc" },
      include: { reporter: true },
    }),
    prisma.auditLog.findMany({
      take: 25,
      orderBy: { createdAt: "desc" },
      include: { actor: true },
    }),
    prisma.user.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.sellerApplication.count({ where: { status: "PENDING" } }),
    prisma.moderationReport.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E1DB] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29] mb-2">
            <Shield className="w-3.5 h-3.5 text-[#A92735]" /> Platform Integrity & Oversight
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
            Curator & Moderation Console
          </h1>
          <p className="text-xs text-[#77716D] mt-1">
            Logged in as Administrator <span className="font-semibold text-[#252321]">{user.displayName}</span> (@{user.username})
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2.5 bg-white border border-[#E7E1DB] rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-[#77716D] uppercase tracking-wider font-semibold">
              Pending Sellers
            </p>
            <p className="font-editorial text-2xl font-bold text-[#A92735]">
              {pendingApplicationsCount}
            </p>
          </div>
          <div className="px-4 py-2.5 bg-white border border-[#E7E1DB] rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-[#77716D] uppercase tracking-wider font-semibold">
              Open Reports
            </p>
            <p className="font-editorial text-2xl font-bold text-[#791D29]">
              {pendingReportsCount}
            </p>
          </div>
          <div className="px-4 py-2.5 bg-white border border-[#E7E1DB] rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-[#77716D] uppercase tracking-wider font-semibold">
              Total Members
            </p>
            <p className="font-editorial text-2xl font-bold text-[#252321]">
              {totalUsers}
            </p>
          </div>
          <div className="px-4 py-2.5 bg-white border border-[#E7E1DB] rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-[#77716D] uppercase tracking-wider font-semibold">
              Active Listings
            </p>
            <p className="font-editorial text-2xl font-bold text-[#252321]">
              {totalProducts}
            </p>
          </div>
        </div>
      </div>

      <AdminConsoleClient
        applications={applications}
        reports={reports}
        auditLogs={auditLogs}
      />
    </div>
  );
}

