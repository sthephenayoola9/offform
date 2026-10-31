import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "OFFFORM — Outside the ordinary | Creative Fashion Community & Marketplace",
  description:
    "An independent creative fashion community with an integrated marketplace. Discover alternative fashion, experimental streetwear, and independent designers.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8F5F0] text-[#252321]">
        <RoleSwitcher
          currentRole={user?.role || "VISITOR"}
          userName={user?.displayName}
        />
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
