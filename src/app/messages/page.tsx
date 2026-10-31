import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MessageSquare, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { MessagesClient } from "@/components/MessagesClient";

export const revalidate = 0;

export default async function MessagesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#FBECEE] text-[#A92735] rounded-3xl flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h1 className="font-editorial text-4xl text-[#252321]">
          Creative Inbox & Inquiries
        </h1>
        <p className="text-sm text-[#77716D] leading-relaxed max-w-md mx-auto">
          Sign in to connect directly with independent designers, respond to collaboration requests, and
          manage commission discussions.
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

  // Fetch all user's conversations
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Get other participant IDs
  const otherUserIds = Array.from(
    new Set(
      conversations.map((c) =>
        c.participant1Id === user.id ? c.participant2Id : c.participant1Id
      )
    )
  );

  const otherUsers = await prisma.user.findMany({
    where: { id: { in: otherUserIds } },
    select: {
      id: true,
      displayName: true,
      username: true,
      avatar: true,
      role: true,
      isVerifiedDesigner: true,
    },
  });

  const otherUserMap = Object.fromEntries(otherUsers.map((u) => [u.id, u]));

  // Also fetch list of active designers for "Start New Chat" modal
  const designers = await prisma.user.findMany({
    where: {
      id: { not: user.id },
      role: { in: ["SELLER", "MEMBER"] },
    },
    take: 8,
    select: {
      id: true,
      displayName: true,
      username: true,
      avatar: true,
      role: true,
      isVerifiedDesigner: true,
    },
  });

  const enrichedConversations = conversations.map((c) => {
    const otherId = c.participant1Id === user.id ? c.participant2Id : c.participant1Id;
    return {
      ...c,
      otherParticipant: otherUserMap[otherId] || {
        id: otherId,
        displayName: "Creator",
        username: "creator",
        avatar: null,
      },
      isSender: c.participant1Id === user.id,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-[#E7E1DB] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29] mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#A92735]" /> Private Creative Inquiries
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321]">
            Conversations & Requests
          </h1>
          <p className="text-xs text-[#77716D] mt-1">
            Protected messaging: Direct message requests require mutual consent before ordinary chat opens.
          </p>
        </div>
      </div>

      <MessagesClient
        currentUserId={user.id}
        initialConversations={enrichedConversations}
        availableDesigners={designers}
      />
    </div>
  );
}

