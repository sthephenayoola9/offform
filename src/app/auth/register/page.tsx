"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    age: 20,
    aestheticTags: "Alternative, Streetwear, Upcycled",
    agreeToPolicies: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.age < 16) {
      setError("Eligibility restriction: You must be at least 16 years of age to register on OFFFORM.");
      setLoading(false);
      return;
    }

    if (!formData.agreeToPolicies) {
      setError("You must read and agree to the Terms of Service and Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/discover");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Join the Creative Fashion Community
        </h2>
        <p className="text-xs text-[#77716D]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#A92735] hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-[#E7E1DB] rounded-2xl shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 bg-[#FBECEE] border border-[#A92735]/20 rounded-xl text-xs text-[#791D29] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#A92735]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                  Username (@handle)
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. mayachen"
                  className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="maya@example.com"
                className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                  Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                  Age (Min. 16 Years)
                </label>
                <input
                  type="number"
                  required
                  min={16}
                  max={120}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 16 })}
                  className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                Aesthetic & Fashion Interests
              </label>
              <input
                type="text"
                value={formData.aestheticTags}
                onChange={(e) => setFormData({ ...formData, aestheticTags: e.target.value })}
                placeholder="e.g. Cyberpunk, Upcycled, Avant-Garde, Minimalist"
                className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
              />
              <p className="text-[10px] text-[#77716D] mt-1">
                Used to tailor your organic Discover feed and recommendation signals.
              </p>
            </div>

            {/* Age Safeguard Notice */}
            <div className="p-3 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-[11px] text-[#77716D] space-y-1">
              <span className="font-semibold text-[#252321] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A92735]" /> Safety & Age Verification
              </span>
              <p>
                OFFFORM strictly requires all members to be 16+. Members aged 16–17 receive an age-safeguarded
                community experience and cannot register as sellers until reaching adulthood.
              </p>
            </div>

            {/* Terms & Policies Consent */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeToPolicies}
                  onChange={(e) => setFormData({ ...formData, agreeToPolicies: e.target.checked })}
                  className="mt-0.5 rounded border-[#E7E1DB] text-[#A92735] focus:ring-[#A92735]"
                />
                <span className="text-xs text-[#77716D] leading-relaxed">
                  I confirm I am 16 years of age or older, and I accept the{" "}
                  <Link href="/policies/terms" className="text-[#252321] underline hover:text-[#A92735]">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="/policies/privacy" className="text-[#252321] underline hover:text-[#A92735]">
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link href="/policies/community" className="text-[#252321] underline hover:text-[#A92735]">
                    Community Guidelines
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4"
            >
              {loading ? "Creating Account..." : "Create OFFFORM Account"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

