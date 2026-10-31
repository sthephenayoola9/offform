import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  aestheticTags: z.string().max(200).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    const { displayName, bio, location, aestheticTags, avatar } = parsed.data;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName,
        bio: bio || null,
        location: location || null,
        aestheticTags: aestheticTags || null,
        avatar: avatar || user.avatar,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

