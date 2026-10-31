import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const requestActionSchema = z.object({
  conversationId: z.string().optional(),
  recipientId: z.string().optional(),
  initialMessage: z.string().optional(),
  action: z.enum(["START", "ACCEPT", "DECLINE"]),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = requestActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { conversationId, recipientId, initialMessage, action } = parsed.data;

    if (action === "START") {
      if (!recipientId || recipientId === user.id) {
        return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
      }

      // Check existing conversation in either order
      let conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { participant1Id: user.id, participant2Id: recipientId },
            { participant1Id: recipientId, participant2Id: user.id },
          ],
        },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            participant1Id: user.id,
            participant2Id: recipientId,
            status: "REQUEST_PENDING",
          },
        });
      }

      if (initialMessage && initialMessage.trim()) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: user.id,
            content: initialMessage,
          },
        });
      }

      return NextResponse.json({ success: true, conversation });
    }

    if (action === "ACCEPT" || action === "DECLINE") {
      if (!conversationId) {
        return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
      }

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }

      // Only recipient can accept/decline
      if (conversation.participant2Id !== user.id) {
        return NextResponse.json({ error: "Forbidden: Only recipient can accept." }, { status: 403 });
      }

      const updated = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: action === "ACCEPT" ? "ACCEPTED" : "DECLINED",
        },
      });

      return NextResponse.json({ success: true, conversation: updated });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (err: any) {
    console.error("Conversation action error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

