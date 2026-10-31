"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  PlusCircle,
  X,
  Send,
  Sparkles,
  Check,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";

interface BriefItem {
  id: string;
  title: string;
  description: string;
  skillsRequired: string;
  budgetRange: string | null;
  status: string;
  createdAt: string | Date;
  owner: {
    id: string;
    displayName: string;
    username: string;
    avatar: string | null;
    isVerifiedDesigner: boolean;
  };
  proposals: { id: string }[];
}

interface CollaborateClientProps {
  initialBriefs: BriefItem[];
  currentUserId?: string;
}

export function CollaborateClient({
  initialBriefs,
  currentUserId,
}: CollaborateClientProps) {
  const [briefs, setBriefs] = useState<BriefItem[]>(initialBriefs);

  // New Brief Modal
  const [newBriefOpen, setNewBriefOpen] = useState(false);
  const [briefTitle, setBriefTitle] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [briefSkills, setBriefSkills] = useState("");
  const [briefBudget, setBriefBudget] = useState("");
  const [submittingBrief, setSubmittingBrief] = useState(false);

  // Proposal Modal
  const [proposingBriefId, setProposingBriefId] = useState<string | null>(null);
  const [propMessage, setPropMessage] = useState("");
  const [propQuote, setPropQuote] = useState("");
  const [propDays, setPropDays] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  const handleCreateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Please sign in or select a member role to publish a brief.");
      return;
    }

    setSubmittingBrief(true);
    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: briefTitle,
          description: briefDescription,
          skillsRequired: briefSkills,
          budgetRange: briefBudget,
        }),
      });
      const data = await res.json();
      if (data.success && data.brief) {
        setBriefs([
          {
            ...data.brief,
            proposals: [],
          },
          ...briefs,
        ]);
        setNewBriefOpen(false);
        setBriefTitle("");
        setBriefDescription("");
        setBriefSkills("");
        setBriefBudget("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingBrief(false);
    }
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !proposingBriefId) return;

    setSubmittingProposal(true);
    try {
      const res = await fetch(`/api/briefs/${proposingBriefId}/proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: propMessage,
          quoteAmount: propQuote,
          estimatedDays: propDays,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProposalSuccess(true);
        setTimeout(() => {
          setProposingBriefId(null);
          setProposalSuccess(false);
          setPropMessage("");
          setPropQuote("");
          setPropDays("");
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingProposal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E1DB] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-[#252321]">
            Open Collaboration Briefs
          </h3>
          <p className="text-xs text-[#77716D]">
            Lookbooks, pattern engineering, 3D visualization, and editorial styling partnerships.
          </p>
        </div>

        <button
          onClick={() => setNewBriefOpen(true)}
          className="px-5 py-2.5 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Post Project Brief
        </button>
      </div>

      {/* Briefs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {briefs.map((brief) => (
          <div
            key={brief.id}
            className="bg-white rounded-2xl border border-[#E7E1DB] p-6 shadow-card hover:border-[#D1C8BF] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Owner info */}
              <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
                <Link
                  href={`/designers/${brief.owner.id}`}
                  className="flex items-center gap-2.5"
                >
                  <img
                    src={brief.owner.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"}
                    alt={brief.owner.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-[#E7E1DB]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#252321] block">
                      {brief.owner.displayName}
                    </span>
                    <span className="text-[10px] text-[#77716D]">@{brief.owner.username}</span>
                  </div>
                </Link>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FBECEE] text-[#791D29]">
                  {brief.status}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#252321]">{brief.title}</h4>
                <p className="text-xs text-[#77716D] leading-relaxed mt-1 line-clamp-3">
                  {brief.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {brief.skillsRequired.split(",").map((s) => (
                  <span
                    key={s.trim()}
                    className="text-[10px] px-2.5 py-0.5 rounded bg-[#F8F5F0] text-[#252321] border border-[#E7E1DB] font-medium"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-4 border-t border-[#F4F1EC] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#A49E99] text-[11px] block">Estimated Budget</span>
                <span className="font-bold text-[#252321]">{brief.budgetRange || "Negotiable"}</span>
              </div>

              <button
                onClick={() => setProposingBriefId(brief.id)}
                className="px-4 py-2 bg-[#252321] text-white hover:bg-[#A92735] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Submit Proposal ({brief.proposals.length})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Brief Modal */}
      {newBriefOpen && (
        <div className="fixed inset-0 z-50 bg-[#252321]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-[#E7E1DB] p-6 shadow-editorial space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
              <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                Publish Creative Brief
              </h3>
              <button
                onClick={() => setNewBriefOpen(false)}
                className="text-[#77716D] hover:text-[#252321]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBrief} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Capsule Lookbook Photographer in Berlin"
                  value={briefTitle}
                  onChange={(e) => setBriefTitle(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  Required Creative Disciplines (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Photographer, Stylist, 3D Artist, Pattern Maker"
                  value={briefSkills}
                  onChange={(e) => setBriefSkills(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  Detailed Scope & Creative Vision *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain deliverables, timeline, aesthetic direction, and licensing terms..."
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  Budget Range (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $1,000 - $2,500 USD"
                  value={briefBudget}
                  onChange={(e) => setBriefBudget(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewBriefOpen(false)}
                  className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs font-semibold text-[#77716D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBrief}
                  className="px-5 py-2 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  {submittingBrief ? "Posting..." : "Post to Network"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Proposal Modal */}
      {proposingBriefId && (
        <div className="fixed inset-0 z-50 bg-[#252321]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-[#E7E1DB] p-6 shadow-editorial space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
              <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                Submit Creative Proposal
              </h3>
              <button
                onClick={() => setProposingBriefId(null)}
                className="text-[#77716D] hover:text-[#252321]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {proposalSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FBECEE] text-[#791D29] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#252321]">Proposal Submitted</h4>
                <p className="text-xs text-[#77716D]">
                  The project creator has received your proposal and quote.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#252321] mb-1">
                    Your Pitch & Creative Approach *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Outline your background, portfolio links, and proposed execution plan..."
                    value={propMessage}
                    onChange={(e) => setPropMessage(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#252321] mb-1">
                      Proposed Fee (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={propQuote}
                      onChange={(e) => setPropQuote(e.target.value)}
                      className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#252321] mb-1">
                      Estimated Delivery Days
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 14"
                      value={propDays}
                      onChange={(e) => setPropDays(e.target.value)}
                      className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setProposingBriefId(null)}
                    className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs font-semibold text-[#77716D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProposal}
                    className="px-5 py-2 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingProposal ? "Sending..." : "Submit Proposal"}
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
