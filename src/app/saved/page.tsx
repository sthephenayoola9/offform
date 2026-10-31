import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Bookmark, Sparkles, ArrowRight, Layers } from "lucide-react";
import { SavedClient } from "@/components/SavedClient";

export const revalidate = 0;

export default async function SavedPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#FBECEE] text-[#A92735] rounded-3xl flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <h1 className="font-editorial text-4xl text-[#252321]">
          Saved Lookbooks & Garments
        </h1>
        <p className="text-sm text-[#77716D] leading-relaxed max-w-md mx-auto">
          Sign in to access your private saved community posts, curated marketplace garments, and personal
          editorial collections.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-white text-[#252321] border border-[#E7E1DB] rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            Join Community
          </Link>
        </div>
      </div>
    );
  }

  // Fetch user's saved items and collections
  const [saves, collections] = await Promise.all([
    prisma.save.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.collection.findMany({
      where: { userId: user.id },
      include: { items: true },
    }),
  ]);

  const postIds = saves.filter((s) => s.targetType === "POST").map((s) => s.targetId);
  const productIds = saves.filter((s) => s.targetType === "PRODUCT").map((s) => s.targetId);

  const [savedPosts, savedProducts] = await Promise.all([
    prisma.post.findMany({
      where: { id: { in: postIds } },
      include: { author: true, likes: true },
    }),
    prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { seller: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-[#E7E1DB] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29] mb-2">
          <Bookmark className="w-3.5 h-3.5 text-[#A92735]" /> Personal Curation & Archives
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
          Saved Content & Collections
        </h1>
        <p className="text-xs text-[#77716D] mt-1">
          Private by default. Only you can view your saved inspiration and marketplace bookmarks.
        </p>
      </div>

      <SavedClient
        savedPosts={savedPosts}
        savedProducts={savedProducts}
        collections={collections}
      />
    </div>
  );
}

