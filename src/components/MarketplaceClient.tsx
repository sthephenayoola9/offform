"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  SlidersHorizontal,
  Check,
  Scale,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export interface ProductItem {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  productType: string;
  price: number;
  currency: string;
  stock: number;
  images: string;
  materials: string | null;
  measurements: string | null;
  productionOrigin: string | null;
  leadTimeDays: number;
  status: string;
  seller: {
    id: string;
    displayName: string;
    username: string;
    isVerifiedDesigner: boolean;
  };
}

interface MarketplaceClientProps {
  products: ProductItem[];
}

export function MarketplaceClient({ products }: MarketplaceClientProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [compareItems, setCompareItems] = useState<ProductItem[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Filter products
  const filtered = products.filter((p) => {
    if (selectedType !== "ALL" && p.productType !== selectedType) return false;
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    return true;
  });

  const toggleCompare = (p: ProductItem) => {
    if (compareItems.some((item) => item.id === p.id)) {
      setCompareItems(compareItems.filter((item) => item.id !== p.id));
    } else {
      if (compareItems.length >= 3) {
        alert("You can compare up to 3 garments at once.");
        return;
      }
      setCompareItems([...compareItems, p]);
      setIsCompareDrawerOpen(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E1DB] shadow-card space-y-6">
        {/* Product Type Mode Tabs */}
        <div>
          <span className="text-[11px] font-bold text-[#77716D] uppercase tracking-wider block mb-2">
            Garment Mode:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "All Garments", value: "ALL" },
              { label: "Ready-Made (In Stock)", value: "READY_MADE" },
              { label: "Made-to-Order", value: "MADE_TO_ORDER" },
              { label: "Customisable", value: "CUSTOMISABLE" },
              { label: "Bespoke Commissions", value: "COMMISSION" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  selectedType === tab.value
                    ? "bg-[#252321] text-white"
                    : "bg-[#F8F5F0] text-[#77716D] hover:text-[#252321]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F4F1EC]">
          <span className="text-[11px] font-bold text-[#77716D] uppercase tracking-wider mr-2">
            Category:
          </span>
          {["ALL", "Outerwear", "Tops", "Bottoms", "Accessories", "Footwear"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                selectedCategory === cat
                  ? "bg-[#A92735] text-white border-[#A92735]"
                  : "bg-white text-[#252321] border-[#E7E1DB] hover:border-[#252321]"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Tray Floating Pill if items selected */}
      {compareItems.length > 0 && !isCompareDrawerOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setIsCompareDrawerOpen(true)}
            className="px-5 py-3 bg-[#252321] text-white rounded-full shadow-editorial flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase border border-[#44403C] hover:bg-[#A92735] transition-all"
          >
            <Scale className="w-4 h-4 text-[#A92735]" />
            Compare ({compareItems.length} / 3 items)
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => {
          const images: string[] = JSON.parse(product.images || "[]");
          const isComparing = compareItems.some((i) => i.id === product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E7E1DB] overflow-hidden flex flex-col group hover:border-[#D1C8BF] shadow-card transition-all"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] bg-[#EFE9E0] overflow-hidden">
                <img
                  src={images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Garment Type Badge */}
                <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white/90 backdrop-blur-md text-[#252321] border border-white/60">
                  {product.productType.replace("_", " ")}
                </span>

                {/* Compare Checkbox Button */}
                <button
                  onClick={() => toggleCompare(product)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full text-xs transition-all ${
                    isComparing
                      ? "bg-[#A92735] text-white"
                      : "bg-white/80 text-[#252321] hover:bg-white"
                  }`}
                  title="Compare garment specifications"
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>

                {/* Lead time */}
                <div className="absolute bottom-3 left-3 bg-[#252321]/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  {product.leadTimeDays === 0
                    ? "Immediate Dispatch"
                    : `Lead time: ~${product.leadTimeDays} days`}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#77716D]">
                      {product.seller.displayName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#A92735]">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#252321] group-hover:text-[#A92735] transition-colors leading-snug">
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#77716D] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F4F1EC] flex items-center justify-between">
                  <span className="font-editorial text-2xl font-bold text-[#252321]">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <Link
                    href={`/marketplace/${product.id}`}
                    className="px-4 py-2 bg-[#252321] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#A92735] transition-colors flex items-center gap-1"
                  >
                    Configure <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Side-by-Side Drawer */}
      {isCompareDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#252321]/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-6xl rounded-t-3xl border-t border-[#E7E1DB] p-6 sm:p-8 shadow-editorial max-h-[85vh] overflow-y-auto space-y-6 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-4">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#252321] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#A92735]" /> Garment Side-by-Side Comparison
                </h3>
                <p className="text-xs text-[#77716D]">
                  Compare materials, production lead times, and tailoring specifications.
                </p>
              </div>
              <button
                onClick={() => setIsCompareDrawerOpen(false)}
                className="p-2 text-[#77716D] hover:text-[#252321] rounded-full hover:bg-[#F8F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareItems.map((item) => {
                const images: string[] = JSON.parse(item.images || "[]");
                return (
                  <div
                    key={item.id}
                    className="border border-[#E7E1DB] rounded-xl p-4 bg-[#FAF7F2] space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#A92735] text-white px-2 py-0.5 rounded">
                        {item.productType.replace("_", " ")}
                      </span>
                      <button
                        onClick={() => toggleCompare(item)}
                        className="text-[#77716D] hover:text-[#A92735]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <img
                      src={images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80"}
                      alt={item.title}
                      className="w-full aspect-[4/3] object-cover rounded-lg border border-[#E7E1DB]"
                    />

                    <div>
                      <h4 className="font-editorial text-lg font-bold text-[#252321]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#77716D]">Studio: {item.seller.displayName}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#E7E1DB]">
                      <div className="flex justify-between">
                        <span className="text-[#77716D]">Price:</span>
                        <span className="font-bold text-[#252321]">
                          {formatPrice(item.price, item.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#77716D]">Lead Time:</span>
                        <span className="font-semibold text-[#252321]">
                          ~{item.leadTimeDays} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#77716D]">Origin:</span>
                        <span className="font-semibold text-[#252321]">
                          {item.productionOrigin || "Not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E7E1DB]">
                      <span className="text-[10px] font-bold uppercase text-[#77716D] block mb-1">
                        Materials:
                      </span>
                      <p className="text-[11px] text-[#252321] line-clamp-2">
                        {item.materials || "Natural blended fibers"}
                      </p>
                    </div>

                    <Link
                      href={`/marketplace/${item.id}`}
                      className="block text-center w-full py-2 bg-[#252321] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#A92735] transition-colors"
                    >
                      View Options
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
