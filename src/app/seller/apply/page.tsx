import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ShieldCheck, Sparkles, Store, Clock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { SellerApplicationForm } from "@/components/SellerApplicationForm";

export const revalidate = 0;

export default async function SellerApplyPage() {
  const user = await getCurrentUser();

  let existingApplication = null;
  if (user) {
    existingApplication = await prisma.sellerApplication.findFirst({
      where: { applicantId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-[#E7E1DB] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29]">
          <Sparkles className="w-3.5 h-3.5 text-[#A92735]" /> Creator Accreditation & Studio Verification
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
          Apply for OFFFORM Seller Verification
        </h1>
        <p className="text-sm text-[#77716D] max-w-2xl leading-relaxed">
          OFFFORM is a curated sanctuary for independent designers, bespoke tailors, and artisanal
          studios. We reject mass dropshipping and fast-fashion counterfeits. Every seller undergoes
          human portfolio and production review.
        </p>
      </div>

      {!user ? (
        <div className="bg-white border border-[#E7E1DB] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <Store className="w-10 h-10 text-[#A92735] mx-auto" />
          <h2 className="font-editorial text-2xl font-normal text-[#252321]">
            Create or sign in to your OFFFORM account first
          </h2>
          <p className="text-xs text-[#77716D] max-w-md mx-auto leading-relaxed">
            Seller applications are linked to your creator profile. Please sign in or join the community
            to begin your application.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-white text-[#252321] border border-[#E7E1DB] hover:border-[#252321] transition-all rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Join Community
            </Link>
          </div>
        </div>
      ) : user.role === "SELLER" || user.isApprovedSeller ? (
        <div className="bg-white border border-[#E7E1DB] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-[#A92735] mx-auto" />
          <h2 className="font-editorial text-3xl font-normal text-[#252321]">
            You are an Approved OFFFORM Seller
          </h2>
          <p className="text-xs text-[#77716D] max-w-md mx-auto leading-relaxed">
            Your studio accreditation is active. You can create product listings, manage made-to-order
            garments, and accept custom commissions directly in your workspace.
          </p>
          <div className="pt-2">
            <Link
              href="/seller"
              className="px-6 py-3.5 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              Enter Seller Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : user.age < 18 ? (
        <div className="bg-[#FBECEE] border border-[#A92735]/20 rounded-3xl p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[#A92735] mx-auto" />
          <h2 className="font-editorial text-2xl font-normal text-[#791D29]">
            Age Requirement Notice (18+)
          </h2>
          <p className="text-xs text-[#791D29] max-w-lg mx-auto leading-relaxed">
            In accordance with platform safety policies and commercial law, seller accounts require
            adulthood (18+). As a valued member aged {user.age}, you have full access to share creative
            looks, post concepts, and participate in community challenges!
          </p>
          <div className="pt-2">
            <Link
              href="/discover"
              className="px-5 py-2.5 bg-[#791D29] text-white rounded-full text-xs font-semibold"
            >
              Return to Community Feed
            </Link>
          </div>
        </div>
      ) : existingApplication && existingApplication.status === "PENDING" ? (
        <div className="bg-white border border-[#E7E1DB] rounded-3xl p-8 sm:p-12 space-y-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FBECEE] text-[#791D29] rounded-2xl">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl font-normal text-[#252321]">
                Application Under Editorial Review
              </h2>
              <p className="text-xs text-[#77716D]">
                Submitted on {new Date(existingApplication.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#F8F5F0] rounded-2xl border border-[#E7E1DB] text-xs text-[#77716D] space-y-2">
            <p className="font-semibold text-[#252321]">
              Atelier: {existingApplication.businessName}
            </p>
            <p>
              Status: <span className="font-bold text-[#A92735] uppercase">Pending Human Review</span>
            </p>
            <p className="leading-relaxed">
              Our moderation and curation board reviews every studio's craftsmanship and production setup.
              You will receive an update once the review is completed. You may also test reviewing this
              application by switching to the Admin role using the top demo bar!
            </p>
          </div>
        </div>
      ) : (
        <SellerApplicationForm />
      )}
    </div>
  );
}

