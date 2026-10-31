import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Bell, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { NotificationsClient } from "@/components/NotificationsClient";

export const revalidate = 0;

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#FBECEE] text-[#A92735] rounded-3xl flex items-center justify-center mx-auto">
          <Bell className="w-8 h-8" />
        </div>
        <h1 className="font-editorial text-4xl text-[#252321]">
          Notification Activity
        </h1>
        <p className="text-sm text-[#77716D] leading-relaxed max-w-md mx-auto">
          Sign in to stay informed regarding community interactions, designer drops, custom commission
          milestones, and platform security alerts.
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

  // Ensure user has initial notification records if none exist
  let userNotifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (userNotifications.length === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          title: "Welcome to OFFFORM Community",
          body: "Your creative account is active. Explore the community feed, discover independent ateliers, and express your raw aesthetic style.",
          category: "SOCIAL",
          isRead: false,
          linkUrl: "/discover",
        },
        {
          userId: user.id,
          title: "Platform Safety & Policy Record",
          body: "Your acceptance of the Terms of Service and Privacy Policy v1.0.0 has been securely logged.",
          category: "SECURITY",
          isRead: false,
          linkUrl: "/policies",
        },
        {
          userId: user.id,
          title: "New Drop: Deconstructed Silhouette Challenge",
          body: "The community challenge is now live. Submit your upcycled raw-edge garment concept before the deadline.",
          category: "COLLAB",
          isRead: false,
          linkUrl: "/events",
        },
      ],
    });

    userNotifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-[#E7E1DB] pb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29] mb-2">
            <Bell className="w-3.5 h-3.5 text-[#A92735]" /> Activity Centre
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
            Notifications
          </h1>
          <p className="text-xs text-[#77716D] mt-1">
            Grouped social activity, commission updates, and essential security notices.
          </p>
        </div>
      </div>

      <NotificationsClient initialNotifications={userNotifications} />
    </div>
  );
}

