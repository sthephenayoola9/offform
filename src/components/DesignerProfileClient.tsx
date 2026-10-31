"use client";

import { useState } from "react";
import { Sparkles, X, Check, Send, AlertCircle } from "lucide-react";

interface DesignerProfileClientProps {
  designerId: string;
  designerName: string;
}

export function DesignerProfileClient({
  designerId,
  designerName,
}: DesignerProfileClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designerId,
          title,
          specifications,
          budget,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Submission failed.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          setModalOpen(false);
          setSuccess(false);
          setTitle("");
          setSpecifications("");
          setBudget("");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="px-5 py-2.5 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5" /> Request Custom Commission
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#252321]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-[#E7E1DB] p-6 shadow-editorial space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                  Commission Proposal
                </h3>
                <p className="text-xs text-[#77716D]">
                  Direct quote request to {designerName}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#77716D] hover:text-[#252321]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FBECEE] text-[#791D29] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#252321]">
                  Brief Dispatched to Studio
                </h4>
                <p className="text-xs text-[#77716D]">
                  The designer will review your specifications and reply with a tailored quote or
                  availability schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCommissionSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-[#FBECEE] text-[#791D29] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-[#252321] mb-1">
                    Garment Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asymmetrical Tailored Coat with Raw Silk Lining"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#252321] mb-1">
                    Design Specifications & Measurements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detail desired silhouettes, reference garments, preferred textiles, target delivery date, and body dimensions..."
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#252321] mb-1">
                    Estimated Budget Range (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs font-semibold text-[#77716D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? "Sending..." : "Submit Quote Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
