import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { role, email } = await request.json();
    const cookieStore = cookies();

    let targetEmail = "elena@offform.art"; // default member
    if (typeof email === "string") {
      const demoEmails = [
        "elena@offform.art",
        "nullform@offform.art",
        "kairos@offform.art",
        "curator@offform.art",
      ];
      if (!demoEmails.includes(email)) {
        return NextResponse.json({ error: "Unknown demo account" }, { status: 400 });
      }
      targetEmail = email;
    } else if (role === "VISITOR") {
      targetEmail = "visitor";
    } else if (role === "SELLER") {
      targetEmail = "nullform@offform.art";
    } else if (role === "ADMIN") {
      targetEmail = "curator@offform.art";
    } else if (role === "MEMBER") {
      targetEmail = "elena@offform.art";
    }

    cookieStore.set("offform_user_email", targetEmail, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "lax",
    });

    return NextResponse.json({ success: true, role, email: targetEmail });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
