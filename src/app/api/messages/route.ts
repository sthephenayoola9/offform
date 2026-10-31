import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = sendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const { conversationId, content } = parsed.data;

    // Check conversation exists and user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (
      conversation.participant1Id !== user.id &&
      conversation.participant2Id !== user.id
    ) {
      return NextResponse.json({ error: "Forbidden: Not your conversation." }, { status: 403 });
    }

    // Recipient must have accepted request per Section 17
    if (conversation.status === "REQUEST_PENDING" && conversation.participant2Id === user.id) {
      return NextResponse.json(
        { error: "Please accept the message request before sending a reply." },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    console.error("Send message error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

