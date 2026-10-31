"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/discover");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");
      router.push("/discover");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-block group">
          <span className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#252321] group-hover:text-[#A92735] transition-colors">
            OFFFORM<span className="text-[#A92735]">.</span>
          </span>
          <span className="block text-[10px] tracking-[0.25em] uppercase text-[#77716D] font-medium mt-1">
            Outside the ordinary
          </span>
        </Link>
        <h2 className="font-editorial text-2xl font-normal text-[#252321]">
          Sign in to your creative account
        </h2>
        <p className="text-xs text-[#77716D]">
          Don't have an account yet?{" "}
          <Link href="/auth/register" className="text-[#A92735] hover:underline font-medium">
            Join the community
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-[#E7E1DB] rounded-2xl shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 bg-[#FBECEE] border border-[#A92735]/20 rounded-xl text-xs text-[#791D29] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#A92735]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77716D] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@offform.art"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#77716D] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to OFFFORM"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-[#F4F1EC] space-y-2.5">
            <p className="text-[11px] font-semibold text-[#77716D] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#A92735]" /> Quick Instant Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("elena@offform.art")}
                className="p-2 text-left border border-[#E7E1DB] rounded-lg hover:border-[#252321] bg-[#F8F5F0]/50 hover:bg-white transition-all"
              >
                <div className="font-medium text-[#252321]">Elena Vance</div>
                <div className="text-[10px] text-[#77716D]">Member</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("nullform@offform.art")}
                className="p-2 text-left border border-[#E7E1DB] rounded-lg hover:border-[#252321] bg-[#F8F5F0]/50 hover:bg-white transition-all"
              >
                <div className="font-medium text-[#252321]">Nullform Archive</div>
                <div className="text-[10px] text-[#A92735]">Designer / Seller</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("kairos@offform.art")}
                className="p-2 text-left border border-[#E7E1DB] rounded-lg hover:border-[#252321] bg-[#F8F5F0]/50 hover:bg-white transition-all"
              >
                <div className="font-medium text-[#252321]">KAIROS Studio</div>
                <div className="text-[10px] text-[#A92735]">Designer / Seller</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("curator@offform.art")}
                className="p-2 text-left border border-[#E7E1DB] rounded-lg hover:border-[#A92735] bg-[#FBECEE]/40 hover:bg-[#FBECEE] transition-all"
              >
                <div className="font-medium text-[#791D29]">Curator Admin</div>
                <div className="text-[10px] text-[#791D29]">Moderator</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
