import Link from "next/link";
import { prisma } from "@/lib/db";
import { ShieldCheck, MapPin, Sparkles, ArrowRight, Store } from "lucide-react";

export const revalidate = 0;

export default async function DesignersPage() {
  const designers = await prisma.user.findMany({
    where: {
      OR: [{ role: "SELLER" }, { isVerifiedDesigner: true }],
    },
    include: {
      products: {
        where: { status: "ACTIVE" },
        take: 3,
      },
      posts: {
        take: 3,
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
          Studio Registry
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321] mt-1">
          Independent Designers
        </h1>
        <p className="text-xs sm:text-sm text-[#77716D] max-w-xl mt-1 leading-relaxed">
          Every designer listed has submitted verified portfolio evidence. Support underground
          ateliers, request bespoke garments, and explore independent fashion houses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designers.map((designer) => (
          <div
            key={designer.id}
            className="bg-white rounded-2xl border border-[#E7E1DB] p-6 shadow-card hover:border-[#D1C8BF] transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <img
                  src={designer.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                  alt={designer.displayName}
                  className="w-16 h-16 rounded-full object-cover border border-[#E7E1DB] shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-editorial text-xl font-bold text-[#252321]">
                      {designer.displayName}
                    </h3>
                  </div>
                  <p className="text-xs text-[#77716D]">@{designer.username}</p>
                  {designer.location && (
                    <p className="text-[11px] text-[#A49E99] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#A92735]" /> {designer.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-1.5">
                {designer.isVerifiedDesigner && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FBECEE] text-[#791D29] border border-[#A92735]/20">
                    <ShieldCheck className="w-3 h-3 text-[#A92735]" /> Verified Designer
                  </span>
                )}
                {designer.isApprovedSeller && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4F1EC] text-[#252321] border border-[#E7E1DB]">
                    <Store className="w-3 h-3" /> Approved Seller
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs text-[#77716D] leading-relaxed line-clamp-3">
                {designer.bio || "Crafting avant-garde garments outside the mainstream calendar."}
              </p>

              {/* Aesthetics Tags */}
              {designer.aestheticTags && (
                <div className="flex flex-wrap gap-1">
                  {designer.aestheticTags.split(",").map((tag) => (
                    <span
                      key={tag.trim()}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F8F5F0] text-[#77716D]"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Counts & Link */}
            <div className="pt-4 border-t border-[#F4F1EC] flex items-center justify-between text-xs">
              <span className="text-[#77716D]">
                <strong className="text-[#252321]">{designer.products.length}</strong> listings
              </span>
              <Link
                href={`/designers/${designer.id}`}
                className="font-semibold text-[#A92735] hover:text-[#791D29] inline-flex items-center gap-1 transition-colors"
              >
                Enter Studio <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
