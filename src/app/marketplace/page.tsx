import { prisma } from "@/lib/db";
import { MarketplaceClient, ProductItem } from "@/components/MarketplaceClient";

export const revalidate = 0;

export default async function MarketplacePage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: {
          id: true,
          displayName: true,
          username: true,
          isVerifiedDesigner: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
          Curated Independent Commerce
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321] mt-1">
          The Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-[#77716D] max-w-xl mt-1 leading-relaxed">
          Four distinct modes: ready-made garments, made-to-order outerwear, designer-configured
          customisations, and direct bespoke commission slots.
        </p>
      </div>

      <MarketplaceClient products={products as ProductItem[]} />
    </div>
  );
}
