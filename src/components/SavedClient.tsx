"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  Bookmark,
  Store,
  Layers,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  X,
  Check,
  Scale,
} from "lucide-react";

interface SavedClientProps {
  savedPosts: any[];
  savedProducts: any[];
  collections: any[];
}

export function SavedClient({
  savedPosts,
  savedProducts,
  collections,
}: SavedClientProps) {
  const [tab, setTab] = useState<"posts" | "products" | "compare">("posts");
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const toggleCompare = (productId: string) => {
    if (selectedForCompare.includes(productId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== productId));
    } else {
      if (selectedForCompare.length >= 3) {
        alert("You can compare up to 3 garments simultaneously.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, productId]);
    }
  };

  const comparedProducts = savedProducts.filter((p) => selectedForCompare.includes(p.id));

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex border-b border-[#E7E1DB] space-x-8">
        <button
          onClick={() => setTab("posts")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            tab === "posts"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Saved Looks & Posts ({savedPosts.length})</span>
        </button>

        <button
          onClick={() => setTab("products")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            tab === "products"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Saved Garments ({savedProducts.length})</span>
        </button>

        {selectedForCompare.length > 0 && (
          <button
            onClick={() => setTab("compare")}
            className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 text-[#A92735] ${
              tab === "compare" ? "border-b-2 border-[#A92735]" : ""
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Side-by-Side Compare ({selectedForCompare.length})</span>
          </button>
        )}
      </div>

      {/* 1. SAVED POSTS */}
      {tab === "posts" && (
        <div className="space-y-6">
          {savedPosts.length === 0 ? (
            <div className="p-16 bg-white border border-[#E7E1DB] rounded-3xl text-center space-y-3 shadow-sm">
              <Bookmark className="w-8 h-8 text-[#77716D] mx-auto" />
              <p className="font-editorial text-2xl text-[#252321]">
                No saved posts yet
              </p>
              <p className="text-xs text-[#77716D] max-w-sm mx-auto leading-relaxed">
                Explore the community feed and bookmark editorial outfit silhouettes and concept ideas.
              </p>
              <div className="pt-2">
                <Link
                  href="/discover"
                  className="px-5 py-2.5 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  Explore Feed <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPosts.map((post) => {
                let images = [];
                try {
                  images = JSON.parse(post.mediaUrls);
                } catch (e) {
                  images = [post.mediaUrls];
                }

                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="group bg-white border border-[#E7E1DB] rounded-2xl overflow-hidden shadow-sm hover:border-[#252321] transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[4/5] bg-[#F8F5F0] overflow-hidden">
                      <img
                        src={images[0]}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#252321]">
                          {post.author.displayName}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-[#77716D]">
                          {post.postType}
                        </span>
                      </div>
                      <p className="text-xs text-[#77716D] line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. SAVED PRODUCTS */}
      {tab === "products" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#77716D]">
              Select checkboxes to compare up to 3 garments side-by-side
            </span>
            {selectedForCompare.length > 1 && (
              <button
                onClick={() => setTab("compare")}
                className="px-4 py-1.5 bg-[#A92735] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#791D29]"
              >
                <Scale className="w-3.5 h-3.5" /> Compare {selectedForCompare.length} Items
              </button>
            )}
          </div>

          {savedProducts.length === 0 ? (
            <div className="p-16 bg-white border border-[#E7E1DB] rounded-3xl text-center space-y-3 shadow-sm">
              <Store className="w-8 h-8 text-[#77716D] mx-auto" />
              <p className="font-editorial text-2xl text-[#252321]">
                No saved garments yet
              </p>
              <p className="text-xs text-[#77716D] max-w-sm mx-auto leading-relaxed">
                Discover independent designers and save bespoke pieces to track pricing and compare fabrics.
              </p>
              <div className="pt-2">
                <Link
                  href="/marketplace"
                  className="px-5 py-2.5 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  Browse Marketplace <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((product) => {
                let images = [];
                try {
                  images = JSON.parse(product.images);
                } catch (e) {
                  images = [product.images];
                }

                const isSelected = selectedForCompare.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all flex flex-col justify-between ${
                      isSelected ? "border-[#A92735] ring-2 ring-[#A92735]/20" : "border-[#E7E1DB]"
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-[#F8F5F0] overflow-hidden">
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCompare(product.id)}
                          className="rounded border-[#E7E1DB] text-[#A92735] focus:ring-[#A92735]"
                        />
                        <span>Compare</span>
                      </label>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-semibold text-[#77716D]">
                          {product.seller.displayName}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#252321]">
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg font-semibold text-[#252321] line-clamp-1">
                        {product.title}
                      </h3>

                      <p className="text-xs text-[#77716D] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-[#77716D] border-t border-[#F4F1EC]">
                        <span>Origin: {product.productionOrigin || "Studio"}</span>
                        <span>Lead: {product.leadTimeDays}d</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8F5F0]/60 border-t border-[#E7E1DB] flex justify-end">
                      <Link
                        href={`/marketplace/${product.id}`}
                        className="text-xs font-semibold text-[#A92735] hover:underline flex items-center gap-1"
                      >
                        View Details <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. SIDE-BY-SIDE COMPARISON TOOL */}
      {tab === "compare" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-3xl text-[#252321]">
              Garment Comparison Matrix
            </h2>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-xs text-[#77716D] hover:text-[#A92735] underline"
            >
              Clear Comparison
            </button>
          </div>

          <div className="bg-white border border-[#E7E1DB] rounded-3xl overflow-x-auto shadow-sm p-6">
            <div className="min-w-[600px] grid grid-cols-4 gap-4 text-xs">
              {/* Row 1: Headers */}
              <div className="font-bold uppercase text-[10px] text-[#77716D] py-3 border-b border-[#F4F1EC]">
                Garment
              </div>
              {comparedProducts.map((p) => {
                let img = "";
                try {
                  img = JSON.parse(p.images)[0];
                } catch (e) {
                  img = p.images;
                }
                return (
                  <div key={p.id} className="py-3 border-b border-[#F4F1EC] space-y-2">
                    <img src={img} alt={p.title} className="w-full h-32 object-cover rounded-xl" />
                    <p className="font-editorial text-base font-semibold text-[#252321] line-clamp-2">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-[#77716D]">{p.seller.displayName}</p>
                  </div>
                );
              })}

              {/* Row 2: Price */}
              <div className="font-semibold text-[#77716D] py-3 border-b border-[#F4F1EC]">
                Price & Currency
              </div>
              {comparedProducts.map((p) => (
                <div key={p.id} className="py-3 border-b border-[#F4F1EC] font-mono font-bold text-sm text-[#252321]">
                  {formatPrice(p.price, p.currency)}
                </div>
              ))}

              {/* Row 3: Product Type */}
              <div className="font-semibold text-[#77716D] py-3 border-b border-[#F4F1EC]">
                Product Model
              </div>
              {comparedProducts.map((p) => (
                <div key={p.id} className="py-3 border-b border-[#F4F1EC]">
                  <span className="font-mono uppercase text-[10px] bg-[#F8F5F0] px-2 py-0.5 rounded border border-[#E7E1DB]">
                    {p.productType}
                  </span>
                </div>
              ))}

              {/* Row 4: Materials */}
              <div className="font-semibold text-[#77716D] py-3 border-b border-[#F4F1EC]">
                Declared Materials
              </div>
              {comparedProducts.map((p) => (
                <div key={p.id} className="py-3 border-b border-[#F4F1EC] text-[#77716D] leading-relaxed">
                  {p.materials || "Natural fiber blend"}
                </div>
              ))}

              {/* Row 5: Lead Time */}
              <div className="font-semibold text-[#77716D] py-3 border-b border-[#F4F1EC]">
                Production Lead Time
              </div>
              {comparedProducts.map((p) => (
                <div key={p.id} className="py-3 border-b border-[#F4F1EC] text-[#252321]">
                  {p.leadTimeDays} business days
                </div>
              ))}

              {/* Row 6: Action */}
              <div className="py-3" />
              {comparedProducts.map((p) => (
                <div key={p.id} className="py-3">
                  <Link
                    href={`/marketplace/${p.id}`}
                    className="block text-center py-2 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider"
                  >
                    View Listing
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

