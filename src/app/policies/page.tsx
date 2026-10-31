import Link from "next/link";
import { prisma } from "@/lib/db";
import { ShieldCheck, FileText, ArrowRight, Scale, BookOpen, AlertCircle } from "lucide-react";

export const revalidate = 0;

export default async function PoliciesIndexPage() {
  const policies = await prisma.policyVersion.findMany({
    orderBy: { type: "asc" },
  });

  const policyTypeMap: Record<string, { label: string; slug: string }> = {
    TERMS: { label: "Terms of Service", slug: "terms" },
    PRIVACY: { label: "Privacy & Data Protection", slug: "privacy" },
    COMMUNITY: { label: "Community Guidelines", slug: "community" },
    SELLER: { label: "Seller Terms & Standards", slug: "seller" },
    REFUND: { label: "Marketplace, Refund & Cancellation", slug: "refund" },
    IP: { label: "Intellectual Property & Anti-Plagiarism", slug: "ip" },
    COLLAB: { label: "Collaboration & Commission Standards", slug: "collab" },
    MODERATION: { label: "Moderation, Enforcement & Appeals", slug: "moderation" },
    COOKIE: { label: "Cookie & Notification Preferences", slug: "cookies" },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-[#E7E1DB] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29]">
          <Scale className="w-3.5 h-3.5 text-[#A92735]" /> Platform Governance & Legal Framework
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
          Policies, Rights & Community Standards
        </h1>
        <p className="text-sm text-[#77716D] max-w-2xl leading-relaxed">
          OFFFORM is built on mutual respect, transparent creator ownership, and strict data dignity.
          All platform policies are versioned, recorded, and accessible to members and visitors at all times.
        </p>
      </div>

      {/* Advisory Alert */}
      <div className="p-4 bg-white border border-[#E7E1DB] rounded-2xl flex items-start gap-3.5 shadow-sm">
        <AlertCircle className="w-5 h-5 text-[#A92735] shrink-0 mt-0.5" />
        <div className="text-xs text-[#77716D] space-y-1">
          <p className="font-semibold text-[#252321]">
            Legal Transparency Notice
          </p>
          <p>
            These policies represent operational standards drafted for OFFFORM's creative ecosystem.
            Inspiration posts remain distinct from commercial sales. Independent designers retain all
            original intellectual property rights in their uploads and patterns.
          </p>
        </div>
      </div>

      {/* Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) => {
          const meta = policyTypeMap[policy.type] || {
            label: policy.title,
            slug: policy.type.toLowerCase(),
          };

          return (
            <Link
              key={policy.id}
              href={`/policies/${meta.slug}`}
              className="p-6 bg-white border border-[#E7E1DB] hover:border-[#252321] rounded-2xl transition-all hover:shadow-editorial group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-[#77716D]">
                  <span className="font-mono uppercase tracking-wider bg-[#F8F5F0] px-2 py-0.5 rounded border border-[#E7E1DB]">
                    v{policy.version}
                  </span>
                  <span>Effective: {new Date(policy.effectiveDate).toLocaleDateString()}</span>
                </div>
                <h3 className="font-editorial text-2xl font-medium text-[#252321] group-hover:text-[#A92735] transition-colors">
                  {policy.title}
                </h3>
                <p className="text-xs text-[#77716D] leading-relaxed line-clamp-3">
                  {policy.summary}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-semibold text-[#A92735] group-hover:translate-x-1 transition-transform gap-1">
                Read full policy <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

