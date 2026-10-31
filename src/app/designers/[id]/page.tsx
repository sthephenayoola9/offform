import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { DesignerProfileClient } from "@/components/DesignerProfileClient";
import {
  ShieldCheck,
  Store,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Heart,
  MessageSquare,
} from "lucide-react";

export const revalidate = 0;

export default async function DesignerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const designer = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      products: {
        where: { status: "ACTIVE" },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!designer) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Designer Studio Header */}
      <div className="bg-white rounded-3xl border border-[#E7E1DB] p-8 sm:p-12 shadow-card space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-6">
            <img
              src={designer.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
              alt={designer.displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#E7E1DB] shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#252321]">
                  {designer.displayName}
                </h1>
                {designer.isVerifiedDesigner && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FBECEE] text-[#791D29] border border-[#A92735]/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A92735]" /> Verified Designer
                  </span>
                )}
                {designer.isApprovedSeller && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4F1EC] text-[#252321] border border-[#E7E1DB]">
                    <Store className="w-3.5 h-3.5" /> Approved Seller
                  </span>
                )}
              </div>

              <p className="text-xs text-[#77716D]">
                @{designer.username} · Member since {new Date(designer.createdAt).getFullYear()}
              </p>

              {designer.location && (
                <p className="text-xs text-[#77716D] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A92735]" /> {designer.location}
                </p>
              )}
            </div>
          </div>

          <DesignerProfileClient
            designerId={designer.id}
            designerName={designer.displayName}
          />
        </div>

        {/* Bio & Aesthetic Focus */}
        <div className="pt-6 border-t border-[#F4F1EC] space-y-4">
          <p className="text-xs sm:text-sm text-[#252321] leading-relaxed max-w-3xl">
            {designer.bio || "Independent studio creating subversive garments."}
          </p>

          {designer.aestheticTags && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-[#77716D] uppercase tracking-wider mr-1">
                Aesthetics:
              </span>
              {designer.aestheticTags.split(",").map((tag) => (
                <span
                  key={tag.trim()}
                  className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7E1DB] text-[#252321]"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Studio Garments */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
              Marketplace Pieces
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#252321]">
              Available Garments ({designer.products.length})
            </h2>
          </div>
        </div>

        {designer.products.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E7E1DB] text-center text-xs text-[#77716D]">
            No ready-made listings currently published. Custom commissions available above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designer.products.map((prod) => {
              const images: string[] = JSON.parse(prod.images || "[]");
              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-[#E7E1DB] overflow-hidden flex flex-col group hover:border-[#D1C8BF] transition-all shadow-card"
                >
                  <div className="relative aspect-[3/4] bg-[#EFE9E0] overflow-hidden">
                    <img
                      src={images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/90 text-[#252321]">
                      {prod.productType.replace("_", " ")}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-editorial text-lg font-bold text-[#252321]">
                        {prod.title}
                      </h4>
                      <p className="text-xs text-[#77716D] line-clamp-2 mt-1">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F4F1EC] flex items-center justify-between">
                      <span className="font-editorial text-xl font-bold text-[#252321]">
                        {formatPrice(prod.price, prod.currency)}
                      </span>
                      <Link
                        href={`/marketplace/${prod.id}`}
                        className="text-xs font-semibold text-[#A92735] hover:underline"
                      >
                        Configure Options →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lookbook / Portfolio Posts */}
      <section className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
            Visual Archive
          </span>
          <h2 className="font-editorial text-3xl font-normal text-[#252321]">
            Editorial Lookbook & Concepts ({designer.posts.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designer.posts.map((post) => {
            const mediaList: string[] = JSON.parse(post.mediaUrls || "[]");
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-[#E7E1DB] overflow-hidden shadow-card"
              >
                <div className="aspect-[4/5] bg-[#EFE9E0] overflow-hidden">
                  <img
                    src={mediaList[0] || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-[#252321] line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#77716D] pt-2 border-t border-[#F4F1EC]">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#A92735]" /> {post.likes.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
