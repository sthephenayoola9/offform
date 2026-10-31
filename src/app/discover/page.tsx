import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { FeedClient } from "@/components/FeedClient";

export const revalidate = 0;

export default async function DiscoverPage() {
  const user = await getCurrentUser();

  const [posts, products] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatar: true,
            isVerifiedDesigner: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                displayName: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        linkedProduct: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
          },
        },
      },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
          Curated Discovery
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321] mt-1">
          The Community Stream
        </h1>
        <p className="text-xs sm:text-sm text-[#77716D] max-w-xl mt-1 leading-relaxed">
          Outfit journals, prototype sketches, and raw inspiration from independent creators around
          the world.
        </p>
      </div>

      <FeedClient
        initialPosts={posts as any}
        currentUserId={user?.id}
        availableProducts={products}
      />
    </div>
  );
}
