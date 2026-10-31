import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileClient } from "@/components/ProfileClient";

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [dbUser, userPosts, userOrders, policyAcceptances] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
    }),
    prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: { likes: true, comments: true },
    }),
    prisma.order.findMany({
      where: { buyerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        seller: true,
        items: { include: { product: true } },
      },
    }),
    prisma.policyAcceptance.findMany({
      where: { userId: user.id },
      orderBy: { acceptedAt: "desc" },
    }),
  ]);

  if (!dbUser) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProfileClient
        user={dbUser}
        posts={userPosts}
        orders={userOrders}
        policyAcceptances={policyAcceptances}
      />
    </div>
  );
}

