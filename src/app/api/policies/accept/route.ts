import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { policyType, version } = await request.json();
    if (!policyType || !version) {
      return NextResponse.json({ error: "Missing policy parameters" }, { status: 400 });
    }

    const acceptance = await prisma.policyAcceptance.upsert({
      where: {
        userId_policyType_version: {
          userId: user.id,
          policyType,
          version,
        },
      },
      update: {
        acceptedAt: new Date(),
      },
      create: {
        userId: user.id,
        policyType,
        version,
      },
    });

    return NextResponse.json({ success: true, acceptance });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

