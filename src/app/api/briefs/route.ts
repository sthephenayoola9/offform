import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to publish a brief." }, { status: 401 });
    }

    const { title, description, skillsRequired, budgetRange } = await request.json();

    if (!title || !description || !skillsRequired) {
      return NextResponse.json(
        { error: "Title, description, and required skills are mandatory." },
        { status: 400 }
      );
    }

    const brief = await prisma.collaborationBrief.create({
      data: {
        ownerId: user.id,
        title: title.trim(),
        description: description.trim(),
        skillsRequired: skillsRequired.trim(),
        budgetRange: budgetRange || null,
        visibility: "PUBLIC",
        status: "OPEN",
      },
      include: {
        owner: true,
      },
    });

    return NextResponse.json({ success: true, brief });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
