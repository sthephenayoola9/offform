"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Lock, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

export function SellerApplicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    bio: "",
    portfolioUrl: "",
    productionCapabilities: "",
    idDocumentRef: "kyc_passport_verified_ref_2026.pdf",
    addressDocumentRef: "kyc_studio_lease_verification_ref_2026.pdf",
    agreeToSellerPolicies: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.agreeToSellerPolicies) {
      setError("You must agree to the Seller Terms and Fulfilment Standards.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-[#E7E1DB] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-[#A92735] mx-auto" />
        <h2 className="font-editorial text-3xl font-normal text-[#252321]">
          Application Submitted Successfully
        </h2>
        <p className="text-xs text-[#77716D] max-w-md mx-auto leading-relaxed">
          Your dossier has been routed to the OFFFORM Curator Review Queue. Human verification protects
          our independent ecosystem from industrial mass duplication.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E7E1DB] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
      {error && (
        <div className="p-4 bg-[#FBECEE] border border-[#A92735]/20 rounded-2xl text-xs text-[#791D29] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#A92735]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Atelier Identity */}
        <div className="space-y-4">
          <h3 className="font-editorial text-xl font-normal text-[#252321] pb-2 border-b border-[#F4F1EC]">
            01. Studio & Atelier Identity
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
              Brand / Atelier Name
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Atelier Kumo or Nullform Studio"
              className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
              Creator Bio & Aesthetic Focus (min 20 characters)
            </label>
            <textarea
              required
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Describe your design philosophy, textile choices, and garment silhouettes..."
              className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
              Portfolio / Lookbook / Archive URL
            </label>
            <input
              type="url"
              required
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://yourportfolio.design or https://instagram.com/yourhandle"
              className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Production & Craftsmanship */}
        <div className="space-y-4">
          <h3 className="font-editorial text-xl font-normal text-[#252321] pb-2 border-b border-[#F4F1EC]">
            02. Production Capability & Craftsmanship
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
              Studio Machinery, Throughput & Sourcing
            </label>
            <textarea
              required
              rows={3}
              value={formData.productionCapabilities}
              onChange={(e) => setFormData({ ...formData, productionCapabilities: e.target.value })}
              placeholder="Detail your sewing/knitting equipment, monthly garment output, whether you do bespoke commissions or small batch runs, and fabric suppliers..."
              className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] focus:outline-none focus:border-[#A92735] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Identity & Address Verification */}
        <div className="space-y-4">
          <h3 className="font-editorial text-xl font-normal text-[#252321] pb-2 border-b border-[#F4F1EC] flex items-center justify-between">
            <span>03. KYC & Verification Evidence</span>
            <span className="text-[10px] font-mono uppercase bg-[#F8F5F0] text-[#77716D] px-2 py-0.5 rounded border border-[#E7E1DB] flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Encrypted Vault
            </span>
          </h3>

          <div className="p-4 bg-[#F8F5F0] rounded-2xl border border-[#E7E1DB] text-xs text-[#77716D] space-y-1">
            <p className="font-semibold text-[#252321] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#A92735]" /> Privacy Protection Guarantee (Section 10.3)
            </p>
            <p className="leading-relaxed">
              Identification and physical address records are strictly isolated in private access-controlled
              storage with cryptographic tokens. They are never rendered publicly or shared with buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                ID Document Reference
              </label>
              <input
                type="text"
                required
                value={formData.idDocumentRef}
                onChange={(e) => setFormData({ ...formData, idDocumentRef: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321]"
              />
              <span className="text-[10px] text-[#77716D]">Passport, Driver's License or National ID reference</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1.5">
                Address Evidence Reference
              </label>
              <input
                type="text"
                required
                value={formData.addressDocumentRef}
                onChange={(e) => setFormData({ ...formData, addressDocumentRef: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321]"
              />
              <span className="text-[10px] text-[#77716D]">Utility bill or studio lease verification reference</span>
            </div>
          </div>
        </div>

        {/* Declarations */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToSellerPolicies}
              onChange={(e) => setFormData({ ...formData, agreeToSellerPolicies: e.target.checked })}
              className="mt-0.5 rounded border-[#E7E1DB] text-[#A92735] focus:ring-[#A92735]"
            />
            <span className="text-xs text-[#77716D] leading-relaxed">
              I acknowledge that I am an adult (18+), that all uploaded work and prototypes are original
              or properly licensed, and I accept the{" "}
              <Link href="/policies/seller" className="text-[#252321] underline hover:text-[#A92735]">
                Seller Terms & Fulfilment Standards
              </Link>
              , including honest lead time commitments and fair customer communications.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {loading ? "Submitting Dossier..." : "Submit Seller Application"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

