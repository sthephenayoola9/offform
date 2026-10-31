import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Search, Sparkles, User, Tag, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q || "";
  const category = searchParams.category || "ALL";

  let posts: any[] = [];
  let designers: any[] = [];
  let products: any[] = [];

  if (query.trim()) {
    if (category === "ALL" || category === "POSTS") {
      posts = await prisma.post.findMany({
        where: {
          OR: [
            { caption: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        include: { author: true },
        take: 6,
      });
    }

    if (category === "ALL" || category === "DESIGNERS") {
      designers = await prisma.user.findMany({
        where: {
          OR: [
            { displayName: { contains: query } },
            { username: { contains: query } },
            { bio: { contains: query } },
            { aestheticTags: { contains: query } },
          ],
        },
        take: 6,
      });
    }

    if (category === "ALL" || category === "PRODUCTS") {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
            { materials: { contains: query } },
          ],
          status: "ACTIVE",
        },
        include: { seller: true },
        take: 6,
      });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
          Unified Discovery
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321] mt-1">
          Search OFFFORM
        </h1>
        <p className="text-xs sm:text-sm text-[#77716D] max-w-xl mt-1 leading-relaxed">
          Search posts, independent designers, and marketplace garments. Private search history
          with zero behavioral profiling.
        </p>
      </div>

      {/* Search Input Form */}
      <form method="GET" className="space-y-4">
        <div className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search keywords, aesthetics (#tactical, #avantgarde), materials, or creators..."
            className="w-full bg-white border border-[#E7E1DB] rounded-2xl py-4 pl-12 pr-28 text-sm text-[#252321] shadow-card focus:outline-none focus:border-[#A92735]"
          />
          <Search className="w-5 h-5 text-[#A49E99] absolute left-4 top-4" />
          <button
            type="submit"
            className="absolute right-3 top-2.5 px-5 py-2 bg-[#252321] hover:bg-[#A92735] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Search
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "POSTS", "DESIGNERS", "PRODUCTS"].map((cat) => (
            <Link
              key={cat}
              href={`/search?q=${encodeURIComponent(query)}&category=${cat}`}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                category === cat
                  ? "bg-[#252321] text-white border-[#252321]"
                  : "bg-white text-[#77716D] border-[#E7E1DB] hover:border-[#252321]"
              }`}
            >
              {cat === "ALL" ? "All Results" : cat}
            </Link>
          ))}
        </div>
      </form>

      {/* Results Section */}
      {query ? (
        <div className="space-y-12">
          {/* Designers Results */}
          {designers.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                Designers & Creators ({designers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {designers.map((d) => (
                  <Link
                    key={d.id}
                    href={`/designers/${d.id}`}
                    className="bg-white p-4 rounded-xl border border-[#E7E1DB] flex items-center gap-3 hover:border-[#A92735] transition-colors"
                  >
                    <img
                      src={d.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"}
                      alt={d.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-[#E7E1DB]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#252321]">{d.displayName}</h4>
                      <p className="text-[11px] text-[#77716D]">@{d.username}</p>
                      <span className="text-[10px] text-[#A92735] font-medium block mt-0.5">
                        {d.aestheticTags || "Independent Creator"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {products.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                Marketplace Garments ({products.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => {
                  const images = JSON.parse(p.images || "[]");
                  return (
                    <Link
                      key={p.id}
                      href={`/marketplace/${p.id}`}
                      className="bg-white rounded-xl border border-[#E7E1DB] p-4 flex gap-4 hover:border-[#A92735] transition-colors"
                    >
                      <img
                        src={images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=200&q=80"}
                        alt={p.title}
                        className="w-20 h-24 object-cover rounded-lg border border-[#E7E1DB] shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#77716D]">
                          {p.category}
                        </span>
                        <h4 className="font-editorial text-base font-bold text-[#252321] line-clamp-1">
                          {p.title}
                        </h4>
                        <span className="text-xs font-bold text-[#A92735] block">
                          {formatPrice(p.price, p.currency)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Posts Results */}
          {posts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                Community Feed Entries ({posts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const media = JSON.parse(post.mediaUrls || "[]");
                  return (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl border border-[#E7E1DB] overflow-hidden"
                    >
                      <img
                        src={media[0] || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80"}
                        alt={post.caption}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="p-3 text-xs">
                        <p className="line-clamp-2 text-[#252321]">{post.caption}</p>
                        <p className="text-[10px] text-[#A92735] font-semibold mt-1">
                          @{post.author.username}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {posts.length === 0 && designers.length === 0 && products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E1DB] space-y-2">
              <p className="text-sm font-bold text-[#252321]">No matches found for &quot;{query}&quot;</p>
              <p className="text-xs text-[#77716D]">
                Try adjusting your search terms or exploring by aesthetic tags.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-[#E7E1DB] space-y-4 text-xs text-[#77716D]">
          <h3 className="font-bold text-sm text-[#252321]">Suggested Discovery Queries</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Modular tactical",
              "Deconstructed mohair",
              "Waxed duck canvas",
              "Belgian minimalism",
              "Upcycled corduroy",
              "Cyberpunk",
            ].map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="px-3 py-1.5 rounded-lg bg-[#F8F5F0] border border-[#E7E1DB] text-[#252321] hover:border-[#A92735]"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
