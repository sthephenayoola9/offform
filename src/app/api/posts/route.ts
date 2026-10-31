import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { caption, postType, mediaUrls, tags, linkedProductId } = await request.json();

    if (!caption || !mediaUrls || mediaUrls.length === 0) {
      return NextResponse.json(
        { error: "Caption and at least one image are required." },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        caption: caption.trim(),
        postType: postType || "OUTFIT",
        mediaUrls: JSON.stringify(mediaUrls),
        tags: tags || "",
        linkedProductId: linkedProductId || null,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
