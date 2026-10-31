import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { ArrowLeft, ShieldCheck, Scissors, Sparkles, Layers } from "lucide-react";

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      seller: {
        select: {
          id: true,
          displayName: true,
          username: true,
          avatar: true,
          bio: true,
          location: true,
          aestheticTags: true,
          isVerifiedDesigner: true,
        },
      },
      customizationOptions: true,
    },
  });

  if (!product) {
    notFound();
  }

  const images: string[] = JSON.parse(product.images || "[]");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Link */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#77716D] hover:text-[#252321] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-[#EFE9E0] rounded-2xl overflow-hidden border border-[#E7E1DB] shadow-editorial">
            <img
              src={images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-white/90 backdrop-blur-md text-[#252321]">
              {product.productType.replace("_", " ")}
            </span>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-[#E7E1DB] bg-[#FAF7F2]"
                >
                  <img src={img} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Garment Specifications & Technical Notes */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1DB] space-y-4 text-xs">
            <h3 className="font-editorial text-xl font-bold text-[#252321]">
              Garment Specifications & Craft
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[#77716D] block font-semibold mb-0.5">Materials</span>
                <p className="text-[#252321]">{product.materials || "Natural blended fibers"}</p>
              </div>
              <div>
                <span className="text-[#77716D] block font-semibold mb-0.5">Origin of Production</span>
                <p className="text-[#252321]">{product.productionOrigin || "Independent atelier"}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#77716D] block font-semibold mb-0.5">Sizing & Measurements</span>
                <p className="text-[#252321]">{product.measurements || "Standard sizing"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Info & Configurator */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Designer Header */}
            <Link
              href={`/designers/${product.seller.id}`}
              className="inline-flex items-center gap-2 mb-2 group"
            >
              <img
                src={product.seller.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"}
                alt={product.seller.displayName}
                className="w-6 h-6 rounded-full object-cover border border-[#E7E1DB]"
              />
              <span className="text-xs font-bold text-[#77716D] group-hover:text-[#A92735] transition-colors">
                {product.seller.displayName}
              </span>
              {product.seller.isVerifiedDesigner && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBECEE] text-[#791D29]">
                  Verified Designer
                </span>
              )}
            </Link>

            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#252321] leading-tight">
              {product.title}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[#77716D] leading-relaxed">
            {product.description}
          </p>

          {/* Interactive Configurator */}
          <ProductConfigurator product={product as any} />
        </div>
      </div>
    </div>
  );
}
