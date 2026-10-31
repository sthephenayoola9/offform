import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft, ShieldCheck, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { PolicyAcceptButton } from "@/components/PolicyAcceptButton";

interface PolicyPageProps {
  params: {
    slug: string;
  };
}

const slugToTypeMap: Record<string, string> = {
  terms: "TERMS",
  privacy: "PRIVACY",
  community: "COMMUNITY",
  seller: "SELLER",
  refund: "REFUND",
  ip: "IP",
  collab: "COLLAB",
  collaboration: "COLLAB",
  moderation: "MODERATION",
  cookies: "COOKIE",
};

export default async function PolicyDetailPage({ params }: PolicyPageProps) {
  const policyType = slugToTypeMap[params.slug.toLowerCase()];
  if (!policyType) {
    notFound();
  }

  const [policy, currentUser] = await Promise.all([
    prisma.policyVersion.findFirst({
      where: { type: policyType },
      orderBy: { effectiveDate: "desc" },
    }),
    getCurrentUser(),
  ]);

  if (!policy) {
    notFound();
  }

  let hasAccepted = false;
  if (currentUser) {
    const acceptance = await prisma.policyAcceptance.findUnique({
      where: {
        userId_policyType_version: {
          userId: currentUser.id,
          policyType: policy.type,
          version: policy.version,
        },
      },
    });
    hasAccepted = !!acceptance;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Back Link */}
      <Link
        href="/policies"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#77716D] hover:text-[#252321] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all policies
      </Link>

      {/* Header */}
      <div className="border-b border-[#E7E1DB] pb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#77716D]">
          <span className="font-mono bg-[#FBECEE] text-[#791D29] px-2.5 py-0.5 rounded-full font-medium">
            Version {policy.version}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Effective:{" "}
            {new Date(policy.effectiveDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-[#A92735] font-medium uppercase tracking-wider text-[11px]">
            Official Operational Policy
          </span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
          {policy.title}
        </h1>

        <div className="p-4 bg-white border border-[#E7E1DB] rounded-2xl text-xs text-[#252321] space-y-1 shadow-sm">
          <p className="font-semibold text-[#A92735] uppercase tracking-wider text-[10px]">
            Executive Summary
          </p>
          <p className="text-[#77716D] leading-relaxed">{policy.summary}</p>
        </div>
      </div>

      {/* Body Content */}
      <div className="prose prose-stone max-w-none space-y-6 text-sm text-[#252321] leading-relaxed bg-white p-8 border border-[#E7E1DB] rounded-2xl shadow-sm">
        <div className="whitespace-pre-line text-sm leading-relaxed text-[#252321]">
          {policy.content}
        </div>

        <div className="mt-8 pt-6 border-t border-[#F4F1EC] text-xs text-[#77716D] space-y-2">
          <p className="font-semibold text-[#252321]">Operational & Jurisdictional Notice</p>
          <p>
            This document sets forth operational rules governing interactions on OFFFORM. It is drafted
            subject to ongoing legal review for applicable jurisdictions, including consumer protection,
            intellectual property, and electronic transactions law. Unilateral waivers of mandatory
            statutory rights are neither intended nor enforced.
          </p>
        </div>
      </div>

      {/* Acceptance Action Banner */}
      {currentUser && (
        <div className="p-6 bg-white border border-[#E7E1DB] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A92735]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#252321]">
                Compliance & Acceptance Record
              </span>
            </div>
            <p className="text-xs text-[#77716D]">
              Signed in as <span className="font-medium text-[#252321]">{currentUser.displayName}</span> (@{currentUser.username})
            </p>
          </div>

          <PolicyAcceptButton
            policyType={policy.type}
            version={policy.version}
            initiallyAccepted={hasAccepted}
          />
        </div>
      )}
    </div>
  );
}

