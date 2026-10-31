import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Flame,
  Layers,
  Scissors,
  Compass,
  MessageSquare,
  Heart,
  Store,
  ExternalLink,
} from "lucide-react";

export const revalidate = 0; // Dynamic on load

export default async function HomePage() {
  const [featuredPosts, featuredDesigners, marketplacePreview, activeChallenge] =
    await Promise.all([
      prisma.post.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          likes: true,
          comments: true,
          linkedProduct: true,
        },
      }),
      prisma.user.findMany({
        where: { role: "SELLER" },
        take: 3,
        include: {
          products: { take: 2 },
        },
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          seller: true,
        },
      }),
      prisma.challenge.findFirst({
        where: { status: "ACTIVE" },
      }),
    ]);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION: Editorial Art Direction with Restrained Red Atmosphere */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 hero-gradient-overlay border-b border-[#E7E1DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29] border border-[#A92735]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A92735] animate-pulse" />
                Alternative Fashion Community & Curated Market
              </div>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[0.98] text-[#252321] tracking-tight">
                Where subversive style <br />
                <span className="font-editorial-italic font-semibold text-[#A92735]">
                  finds form.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#77716D] max-w-xl font-normal leading-relaxed">
                OFFFORM is an independent ecosystem for alternative fashion, raw silhouettes, and
                emerging creators. Connect with underground designers, commission bespoke garments,
                and discover inspiration far outside the commercial algorithm.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="/discover"
                  className="px-6 py-3.5 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm"
                >
                  Explore Feed <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/marketplace"
                  className="px-6 py-3.5 bg-white text-[#252321] border border-[#E7E1DB] hover:border-[#252321] transition-all rounded-full text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2"
                >
                  Browse Marketplace
                </Link>
                <Link
                  href="/seller/apply"
                  className="px-6 py-3.5 text-[#A92735] hover:bg-[#FBECEE] rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Apply to Sell →
                </Link>
              </div>

              {/* Aesthetic Filter Quick Tags */}
              <div className="pt-6 border-t border-[#E7E1DB]/60 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-[#77716D] uppercase tracking-wider mr-1">
                  Aesthetics:
                </span>
                {[
                  "Cyber-Streetwear",
                  "Deconstructed",
                  "Upcycled Denim",
                  "Minimal Dystopian",
                  "Artisanal Waxed",
                ].map((tag) => (
                  <Link
                    key={tag}
                    href={`/discover?tag=${encodeURIComponent(tag.toLowerCase())}`}
                    className="text-xs px-3 py-1 rounded-full bg-white border border-[#E7E1DB] text-[#252321] hover:border-[#A92735] hover:text-[#A92735] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Editorial Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#EFE9E0] border border-[#E7E1DB] shadow-editorial group">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
                    alt="OFFFORM Editorial Look"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#252321]/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Image Overlay Label */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="inline-block text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-[#A92735] font-semibold">
                      Featured Concept
                    </span>
                    <h3 className="font-editorial text-2xl font-bold">
                      Nullform Studio — AW26 Deconstructed
                    </h3>
                    <p className="text-xs text-[#E7E1DB] line-clamp-1">
                      Raw distressed mohair, exposed stitching, and hand-worked silver clips.
                    </p>
                  </div>
                </div>

                {/* Overlapping Floating Tag */}
                <div className="absolute -bottom-6 -left-6 bg-white border border-[#E7E1DB] p-4 rounded-xl shadow-editorial hidden sm:block max-w-xs animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FBECEE] flex items-center justify-center text-[#791D29]">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#252321]">Zero Mass Production</p>
                      <p className="text-[11px] text-[#77716D]">
                        Every product verified or made-to-order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY PILLARS: Community First */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
            Platform Principles
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#252321]">
            A Creative Journal with a Curated Market
          </h2>
          <p className="text-xs sm:text-sm text-[#77716D] leading-relaxed">
            Inspiration remains distinct from commerce. Discover outfits, engage with authentic
            creators, and support independent craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl border border-[#E7E1DB] space-y-4 hover:border-[#D1C8BF] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5F0] flex items-center justify-center text-[#252321]">
              <Compass className="w-5 h-5 text-[#A92735]" />
            </div>
            <h3 className="font-editorial text-2xl font-normal text-[#252321]">
              Organic Social Discovery
            </h3>
            <p className="text-xs text-[#77716D] leading-relaxed">
              Feeds driven by aesthetic relevance and creative merit, not by aggressive ad bidding.
              Browse lookbooks, concept sketches, and styling portfolios.
            </p>
            <Link
              href="/discover"
              className="text-xs font-semibold text-[#A92735] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Enter Community Feed <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#E7E1DB] space-y-4 hover:border-[#D1C8BF] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5F0] flex items-center justify-center text-[#252321]">
              <ShieldCheck className="w-5 h-5 text-[#A92735]" />
            </div>
            <h3 className="font-editorial text-2xl font-normal text-[#252321]">
              Human-Verified Designers
            </h3>
            <p className="text-xs text-[#77716D] leading-relaxed">
              Every seller undergoes mandatory portfolio and KYC verification. We protect original
              intellectual property and celebrate authentic design origins.
            </p>
            <Link
              href="/designers"
              className="text-xs font-semibold text-[#A92735] inline-flex items-center gap-1 hover:underline pt-2"
            >
              View Verified Creators <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#E7E1DB] space-y-4 hover:border-[#D1C8BF] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5F0] flex items-center justify-center text-[#252321]">
              <Layers className="w-5 h-5 text-[#A92735]" />
            </div>
            <h3 className="font-editorial text-2xl font-normal text-[#252321]">
              Four Flexible Commerce Modes
            </h3>
            <p className="text-xs text-[#77716D] leading-relaxed">
              Ready-made stock, made-to-order garments, designer-configured customisation, and
              direct custom commission workflows.
            </p>
            <Link
              href="/marketplace"
              className="text-xs font-semibold text-[#A92735] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Explore Products <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. COMMUNITY FEED PREVIEW: Editorial Lookbook */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
              Community Voices
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#252321]">
              Recent Editorial Entries
            </h2>
          </div>
          <Link
            href="/discover"
            className="text-xs font-semibold uppercase tracking-wider text-[#252321] hover:text-[#A92735] inline-flex items-center gap-1 transition-colors"
          >
            View Full Feed ({featuredPosts.length} posts) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => {
            const mediaList: string[] = JSON.parse(post.mediaUrls || "[]");
            return (
              <article
                key={post.id}
                className="bg-white rounded-xl border border-[#E7E1DB] overflow-hidden flex flex-col group hover:border-[#D1C8BF] transition-all shadow-card"
              >
                {/* Author Info */}
                <div className="p-4 flex items-center justify-between border-b border-[#F4F1EC]">
                  <Link
                    href={`/designers/${post.author.id}`}
                    className="flex items-center gap-2.5"
                  >
                    <img
                      src={post.author.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={post.author.displayName}
                      className="w-8 h-8 rounded-full object-cover border border-[#E7E1DB]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#252321] group-hover:text-[#A92735] transition-colors leading-none">
                        {post.author.displayName}
                      </h4>
                      <p className="text-[10px] text-[#77716D] mt-0.5">@{post.author.username}</p>
                    </div>
                  </Link>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#F8F5F0] text-[#77716D]">
                    {post.postType}
                  </span>
                </div>

                {/* Media Image */}
                <div className="relative aspect-[4/5] bg-[#EFE9E0] overflow-hidden">
                  <img
                    src={mediaList[0] || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"}
                    alt={post.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.linkedProduct && (
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-lg border border-white/40 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#252321] truncate max-w-[180px]">
                        Linked: {post.linkedProduct.title}
                      </span>
                      <span className="font-bold text-[#A92735]">
                        {formatPrice(post.linkedProduct.price)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Caption & Interaction */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-[#252321] leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>

                  <div className="pt-2 border-t border-[#F4F1EC] flex items-center justify-between text-xs text-[#77716D]">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#A92735]" /> {post.likes.length}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {post.comments.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A49E99]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. ACTIVE CHALLENGE BANNER */}
      {activeChallenge && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-[#252321] text-white p-8 sm:p-12 border border-[#3E3A36]">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#A92735] text-white">
                <Flame className="w-3.5 h-3.5" /> Active Creative Challenge
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-normal leading-tight">
                {activeChallenge.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#D8D1C9] leading-relaxed">
                {activeChallenge.prompt}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <span className="text-[#A49E99]">
                  Judging Method: <strong className="text-white">Community & Expert Jury</strong>
                </span>
                <Link
                  href="/events"
                  className="px-5 py-2.5 rounded-full bg-white text-[#252321] hover:bg-[#FBECEE] hover:text-[#791D29] font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  Submit Look <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. MARKETPLACE CAPSULE: 4 Supported Garment Modes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
              Curated Catalog
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#252321]">
              Featured Independent Garments
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-semibold uppercase tracking-wider text-[#252321] hover:text-[#A92735] inline-flex items-center gap-1 transition-colors"
          >
            Explore Marketplace ({marketplacePreview.length} available) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketplacePreview.map((product) => {
            const images: string[] = JSON.parse(product.images || "[]");
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#E7E1DB] overflow-hidden flex flex-col group hover:border-[#D1C8BF] transition-all"
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-[#EFE9E0] overflow-hidden">
                  <img
                    src={images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Mode Badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[#252321] border border-white/60">
                    {product.productType.replace("_", " ")}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <p className="text-[11px] text-[#77716D] font-medium">
                      {product.seller.displayName}
                    </p>
                    <h4 className="text-xs font-bold text-[#252321] line-clamp-1 group-hover:text-[#A92735] transition-colors">
                      {product.title}
                    </h4>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#F4F1EC]">
                    <span className="text-sm font-bold text-[#252321]">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="text-xs font-semibold text-[#A92735] hover:underline"
                    >
                      View Options →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FEATURED CREATORS DIRECTORY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-2xl border border-[#E7E1DB] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
                Independent Talent
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#252321]">
                Featured Studios & Ateliers
              </h2>
            </div>
            <Link
              href="/designers"
              className="text-xs font-semibold uppercase tracking-wider text-[#252321] hover:text-[#A92735] inline-flex items-center gap-1 transition-colors"
            >
              Search Designer Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDesigners.map((designer) => (
              <div
                key={designer.id}
                className="bg-white p-6 rounded-xl border border-[#E7E1DB] space-y-4 hover:border-[#D1C8BF] transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={designer.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                    alt={designer.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-[#E7E1DB]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[#252321]">{designer.displayName}</h4>
                      {designer.isVerifiedDesigner && (
                        <span className="w-2 h-2 rounded-full bg-[#A92735]" title="Verified Designer" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#77716D]">
                      @{designer.username} · {designer.location}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#77716D] leading-relaxed line-clamp-3">
                  {designer.bio}
                </p>

                <div className="pt-2 border-t border-[#F4F1EC] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#A92735]">
                    {designer.aestheticTags}
                  </span>
                  <Link
                    href={`/designers/${designer.id}`}
                    className="text-xs font-semibold text-[#252321] hover:text-[#A92735]"
                  >
                    View Studio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COLLABORATION INVITATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
          Creative Network
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#252321]">
          Are you an independent designer, pattern maker, or stylist?
        </h2>
        <p className="text-xs sm:text-sm text-[#77716D] max-w-xl mx-auto leading-relaxed">
          OFFFORM is built for creators outside the commercial fashion calendar. Maintain 100%
          ownership of your intellectual property and sell on your own terms.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/seller/apply"
            className="px-6 py-3 bg-[#A92735] text-white hover:bg-[#791D29] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            Apply for Seller Verification <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/collaborate"
            className="px-6 py-3 bg-white text-[#252321] border border-[#E7E1DB] hover:border-[#252321] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Browse Creative Briefs
          </Link>
        </div>
      </section>
    </div>
  );
}
