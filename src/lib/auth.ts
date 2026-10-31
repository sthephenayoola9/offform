import { cookies } from "next/headers";
import { prisma } from "./db";

export interface AuthSession {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  role: "VISITOR" | "MEMBER" | "SELLER" | "ADMIN";
  age: number;
  isApprovedSeller: boolean;
  isVerifiedDesigner: boolean;
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const sessionUserEmail = cookieStore.get("offform_user_email")?.value;

  if (!sessionUserEmail) {
    // Default fallback to member Elena Vance for immediate rich interactive experience
    const defaultUser = await prisma.user.findUnique({
      where: { email: "elena@offform.art" },
    });
    if (!defaultUser) return null;
    return {
      id: defaultUser.id,
      email: defaultUser.email,
      username: defaultUser.username,
      displayName: defaultUser.displayName,
      avatar: defaultUser.avatar,
      role: defaultUser.role as any,
      age: defaultUser.age,
      isApprovedSeller: defaultUser.isApprovedSeller,
      isVerifiedDesigner: defaultUser.isVerifiedDesigner,
    };
  }

  if (sessionUserEmail === "visitor") {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionUserEmail },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    role: user.role as any,
    age: user.age,
    isApprovedSeller: user.isApprovedSeller,
    isVerifiedDesigner: user.isVerifiedDesigner,
  };
}
