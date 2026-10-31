"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

interface PolicyAcceptButtonProps {
  policyType: string;
  version: string;
  initiallyAccepted: boolean;
}

export function PolicyAcceptButton({
  policyType,
  version,
  initiallyAccepted,
}: PolicyAcceptButtonProps) {
  const [accepted, setAccepted] = useState(initiallyAccepted);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (accepted || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/policies/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyType, version }),
      });

      if (!res.ok) {
        throw new Error("Failed to record acceptance");
      }

      setAccepted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (accepted) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F1EC] text-[#252321] text-xs font-semibold border border-[#E7E1DB]">
        <CheckCircle2 className="w-4 h-4 text-[#A92735]" />
        Accepted v{version}
      </div>
    );
  }

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className="px-5 py-2.5 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 disabled:opacity-50 shadow-sm"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recording...
        </>
      ) : (
        <>
          <ShieldCheck className="w-3.5 h-3.5" /> Accept Version {version}
        </>
      )}
    </button>
  );
}

