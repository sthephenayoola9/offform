import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Store, Sparkles, ArrowRight, Package, Scissors, DollarSign, Clock } from "lucide-react";
import { SellerWorkspaceClient } from "@/components/SellerWorkspaceClient";

export const revalidate = 0;

export default async function SellerWorkspacePage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#FBECEE] text-[#A92735] rounded-3xl flex items-center justify-center mx-auto">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="font-editorial text-4xl text-[#252321]">
          Seller Studio Workspace
        </h1>
        <p className="text-sm text-[#77716D] leading-relaxed max-w-md mx-auto">
          The Seller Studio is exclusively accessible to verified designers and approved ateliers on
          OFFFORM. Manage ready-made inventory, made-to-order production queues, and bespoke commission briefs.
        </p>
        <div className="p-4 bg-white border border-[#E7E1DB] rounded-2xl text-xs text-[#77716D] max-w-md mx-auto space-y-2">
          <p className="font-semibold text-[#252321] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A92735]" /> Demo Environment Tip
          </p>
          <p>
            You can test the Seller Studio immediately by clicking <strong>"Seller"</strong> on the demo
            bar at the top to sign in as <em>Nullform Archive</em>!
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/seller/apply"
            className="px-6 py-3 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
          >
            Apply to Sell <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/marketplace"
            className="px-6 py-3 bg-white text-[#252321] border border-[#E7E1DB] rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Fetch seller's data
  const [products, orders, commissionRequests] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
      include: { customizationOptions: true },
    }),
    prisma.order.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        buyer: true,
        items: { include: { product: true } },
        history: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.commissionRequest.findMany({
      where: { designerId: user.id },
      orderBy: { createdAt: "desc" },
      include: { buyer: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Workspace Header */}
      <div className="border-b border-[#E7E1DB] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29] mb-2">
            <Store className="w-3.5 h-3.5 text-[#A92735]" /> Independent Studio Workspace
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
            {user.displayName} Atelier Studio
          </h1>
          <p className="text-xs text-[#77716D] mt-1">
            Status: <span className="text-[#A92735] font-semibold">Accredited Seller</span> · Lead time standards enforced
          </p>
        </div>

        {/* Studio Summary Metrics */}
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2.5 bg-white border border-[#E7E1DB] rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-[#77716D] uppercase tracking-wider font-semibold">
              Live Listings
            </p>
            <p className="font-editorial text-2xl font-bold text-[#252321]">
              {products.filter((p) => p.status === "ACTIVE").length}
            </p>
          </div>
          <div className="px-4 py-2.5 bg-white border border-[#E7E1DB] rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-[#77716D] uppercase tracking-wider font-semibold">
              Active Orders
            </p>
            <p className="font-editorial text-2xl font-bold text-[#A92735]">
              {orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length}
            </p>
          </div>
          <div className="px-4 py-2.5 bg-white border border-[#E7E1DB] rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-[#77716D] uppercase tracking-wider font-semibold">
              Commissions
            </p>
            <p className="font-editorial text-2xl font-bold text-[#252321]">
              {commissionRequests.length}
            </p>
          </div>
        </div>
      </div>

      <SellerWorkspaceClient
        initialProducts={products}
        initialOrders={orders}
        commissionRequests={commissionRequests}
        sellerId={user.id}
      />
    </div>
  );
}

