import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PostDetailClient } from "@/components/PostDetailClient";

interface PostPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0;

export default async function PostDetailPage({ params }: PostPageProps) {
  const [post, currentUser] = await Promise.all([
    prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: { createdAt: "asc" },
        },
        linkedProduct: {
          include: {
            seller: true,
          },
        },
      },
    }),
    getCurrentUser(),
  ]);

  if (!post) {
    notFound();
  }

  // Also check if current user has saved this post
  let isSaved = false;
  if (currentUser) {
    const saveRecord = await prisma.save.findFirst({
      where: {
        userId: currentUser.id,
        targetType: "POST",
        targetId: post.id,
      },
    });
    isSaved = !!saveRecord;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PostDetailClient
        post={post}
        currentUserId={currentUser?.id}
        initialSaved={isSaved}
      />
    </div>
  );
}

