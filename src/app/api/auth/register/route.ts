import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  age: z.number().int().min(16, "You must be at least 16 years old to join OFFFORM"),
  aestheticTags: z.string().optional(),
  agreeToPolicies: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms of Service and Privacy Policy" }),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { email, password, username, displayName, age, aestheticTags } = parsed.data;

    // Check age safeguard
    if (age < 16) {
      return NextResponse.json(
        { error: "Access Restricted: You must be at least 16 years old to join OFFFORM." },
        { status: 403 }
      );
    }

    // Check unique email and username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "This username is already taken. Please choose another." },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username,
        displayName,
        age,
        aestheticTags: aestheticTags || "Streetwear, Alternative",
        role: "MEMBER",
        isApprovedSeller: false,
        isVerifiedDesigner: false,
      },
    });

    // Record policy acceptance for version 1.0.0
    await prisma.policyAcceptance.createMany({
      data: [
        { userId: newUser.id, policyType: "TERMS", version: "1.0.0" },
        { userId: newUser.id, policyType: "PRIVACY", version: "1.0.0" },
        { userId: newUser.id, policyType: "COMMUNITY", version: "1.0.0" },
      ],
    }).catch(() => {
      // Ignored if duplicate or non-blocking
    });

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set("offform_user_email", newUser.email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "lax",
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.displayName,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }
}

