import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;
    const existingSave = await prisma.save.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType: "POST",
          targetId: postId,
        },
      },
    });

    if (existingSave) {
      await prisma.save.delete({
        where: { id: existingSave.id },
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.save.create({
        data: {
          userId: user.id,
          targetType: "POST",
          targetId: postId,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
