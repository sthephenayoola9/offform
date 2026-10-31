"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, User, Store, Eye } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: string;
  userName?: string;
}

export function RoleSwitcher({ currentRole, userName }: RoleSwitcherProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const switchRole = async (role: "VISITOR" | "MEMBER" | "SELLER" | "ADMIN") => {
    setLoading(true);
    try {
      await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#252321] text-white py-1.5 px-4 text-xs tracking-wide border-b border-[#3E3A36] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#A92735] text-white">
            <Sparkles className="w-3 h-3" /> DEMO ROLE SWITCHER
          </span>
          <span className="text-[#A49E99] hidden sm:inline">Active session:</span>
          <span className="font-semibold text-white">
            {userName ? `${userName} (${currentRole})` : "Public Visitor"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[#A49E99] text-[11px] mr-1 hidden md:inline">Test as:</span>
          
          <button
            onClick={() => switchRole("VISITOR")}
            disabled={loading}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              currentRole === "VISITOR"
                ? "bg-white text-[#252321]"
                : "bg-[#33302D] text-[#D8D1C9] hover:bg-[#44403C]"
            }`}
          >
            <Eye className="w-3 h-3" /> Visitor
          </button>

          <button
            onClick={() => switchRole("MEMBER")}
            disabled={loading}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              currentRole === "MEMBER"
                ? "bg-[#A92735] text-white"
                : "bg-[#33302D] text-[#D8D1C9] hover:bg-[#44403C]"
            }`}
          >
            <User className="w-3 h-3" /> Member (Elena)
          </button>

          <button
            onClick={() => switchRole("SELLER")}
            disabled={loading}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              currentRole === "SELLER"
                ? "bg-[#A92735] text-white"
                : "bg-[#33302D] text-[#D8D1C9] hover:bg-[#44403C]"
            }`}
          >
            <Store className="w-3 h-3" /> Seller (Nullform)
          </button>

          <button
            onClick={() => switchRole("ADMIN")}
            disabled={loading}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              currentRole === "ADMIN"
                ? "bg-[#A92735] text-white"
                : "bg-[#33302D] text-[#D8D1C9] hover:bg-[#44403C]"
            }`}
          >
            <Shield className="w-3 h-3" /> Admin (Curator)
          </button>
        </div>
      </div>
    </div>
  );
}
