"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  Sparkles,
  Scissors,
  ArrowRight,
  Send,
  ShieldCheck,
  Store,
  ChevronLeft,
} from "lucide-react";

interface PostDetailClientProps {
  post: any;
  currentUserId?: string;
  initialSaved: boolean;
}

export function PostDetailClient({
  post,
  currentUserId,
  initialSaved,
}: PostDetailClientProps) {
  const [likes, setLikes] = useState<string[]>(post.likes.map((l: any) => l.userId));
  const [comments, setComments] = useState<any[]>(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportCategory, setReportCategory] = useState("MISLEADING");
  const [reportedSubmitted, setReportedSubmitted] = useState(false);

  const isLiked = currentUserId ? likes.includes(currentUserId) : false;

  let mediaUrls: string[] = [];
  try {
    mediaUrls = JSON.parse(post.mediaUrls);
  } catch (e) {
    mediaUrls = [post.mediaUrls];
  }

  const handleLike = async () => {
    if (!currentUserId) return;
    const nextLiked = !isLiked;
    setLikes(nextLiked ? [...likes, currentUserId] : likes.filter((id) => id !== currentUserId));

    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!currentUserId) return;
    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      await fetch(`/api/posts/${post.id}/save`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);

    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([...comments, newComment]);
        setCommentText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "POST",
          targetId: post.id,
          category: reportCategory,
          reason: reportReason,
        }),
      });
      setReportedSubmitted(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportedSubmitted(false);
        setReportReason("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77716D] hover:text-[#252321] transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Discover Feed
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Media Showcase (Left col) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E7E1DB] rounded-3xl overflow-hidden shadow-sm">
            <div className="space-y-2">
              {mediaUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={post.caption}
                  className="w-full object-cover max-h-[750px]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Details & Community Thread (Right col) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Post Header & Author Card */}
          <div className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <Link
                href={`/designers/${post.author.id}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={
                    post.author.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  }
                  alt={post.author.displayName}
                  className="w-12 h-12 rounded-full object-cover border border-[#E7E1DB]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#252321] group-hover:text-[#A92735] transition-colors">
                      {post.author.displayName}
                    </span>
                    {post.author.isVerifiedDesigner && (
                      <span className="badge-verified-designer text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#77716D]">@{post.author.username}</span>
                </div>
              </Link>

              <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 bg-[#F8F5F0] border border-[#E7E1DB] rounded-full text-[#77716D]">
                {post.postType}
              </span>
            </div>

            {/* Caption */}
            <p className="text-sm text-[#252321] leading-relaxed whitespace-pre-line">
              {post.caption}
            </p>

            {/* Aesthetic Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.split(",").map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F8F5F0] text-[#77716D] border border-[#E7E1DB]"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F4F1EC]">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isLiked ? "text-[#A92735]" : "text-[#77716D] hover:text-[#252321]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  <span>{likes.length}</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-medium text-[#77716D]">
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  aria-label="Save post"
                  className={`p-2 rounded-full border transition-all ${
                    saved
                      ? "bg-[#252321] text-white border-[#252321]"
                      : "border-[#E7E1DB] text-[#77716D] hover:text-[#252321]"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                </button>

                <button
                  onClick={() => setReportModalOpen(true)}
                  aria-label="Report content"
                  className="p-2 rounded-full border border-[#E7E1DB] text-[#77716D] hover:text-[#A92735] hover:border-[#A92735] transition-all"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Inspiration to Commerce Card */}
          {post.linkedProduct ? (
            <div className="bg-[#FAF8F5] border border-[#E7E1DB] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A92735]">
                <Store className="w-3.5 h-3.5" /> Linked Marketplace Product
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-editorial text-lg font-semibold text-[#252321]">
                    {post.linkedProduct.title}
                  </h4>
                  <p className="text-xs font-mono font-medium text-[#252321] mt-0.5">
                    {formatPrice(post.linkedProduct.price, post.linkedProduct.currency)}
                  </p>
                </div>
                <Link
                  href={`/marketplace/${post.linkedProduct.id}`}
                  className="px-4 py-2 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  View Product →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E7E1DB] rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#77716D]">
                <Sparkles className="w-3.5 h-3.5 text-[#A92735]" /> Inspiration & Concept Post
              </div>
              <p className="text-xs text-[#77716D] leading-relaxed">
                This post represents creative inspiration and personal expression. It is not an
                automated catalog product. You can request a bespoke commission from this creator.
              </p>
              <Link
                href={`/designers/${post.author.id}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#A92735] hover:underline uppercase tracking-wider"
              >
                <Scissors className="w-3.5 h-3.5" /> Request Bespoke Commission →
              </Link>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-editorial text-xl font-medium text-[#252321]">
              Community Discussion ({comments.length})
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-[#77716D] py-4 text-center">
                  No comments yet. Start the creative conversation.
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="text-xs space-y-1 pb-3 border-b border-[#F4F1EC] last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#252321]">
                        {comment.author?.displayName || "Member"}
                      </span>
                      <span className="text-[10px] text-[#77716D]">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#77716D] leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            {currentUserId ? (
              <form onSubmit={handleComment} className="flex gap-2 pt-2 border-t border-[#F4F1EC]">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share a thoughtful comment..."
                  className="flex-1 px-3.5 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] placeholder-[#77716D]/50 focus:outline-none focus:border-[#A92735]"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-4 py-2 bg-[#252321] text-white hover:bg-[#A92735] rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="pt-2 border-t border-[#F4F1EC] text-center">
                <Link
                  href="/auth/login"
                  className="text-xs text-[#A92735] font-semibold hover:underline"
                >
                  Sign in to join the discussion →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Moderation Reporting Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E1DB] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-editorial text-2xl font-normal text-[#252321]">
              Report Community Content
            </h3>
            <p className="text-xs text-[#77716D] leading-relaxed">
              We uphold community safety, original creator attribution, and platform standards. Reports
              are reviewed by human moderators in our moderation queue.
            </p>

            {reportedSubmitted ? (
              <div className="p-4 bg-[#F4F1EC] text-[#252321] rounded-2xl text-xs font-medium text-center">
                ✓ Report submitted to the moderation triage queue. Thank you.
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1">
                    Violation Category
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                  >
                    <option value="STOLEN_DESIGN">Stolen Design / IP Infringement</option>
                    <option value="MISLEADING">Misleading Commercial Claim</option>
                    <option value="HARASSMENT">Harassment or Abuse</option>
                    <option value="SPAM">Spam or Inauthentic Activity</option>
                    <option value="INAPPROPRIATE">Inappropriate Content</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#252321] uppercase tracking-wider mb-1">
                    Explanation & Details
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Provide relevant context for the human moderation review..."
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 border border-[#E7E1DB] rounded-xl text-xs text-[#77716D] hover:bg-[#F8F5F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A92735] text-white rounded-xl text-xs font-semibold hover:bg-[#791D29]"
                  >
                    Submit Report
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

