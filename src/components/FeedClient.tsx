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
  PlusCircle,
  SlidersHorizontal,
  X,
  Check,
  Send,
} from "lucide-react";

interface PostItem {
  id: string;
  authorId: string;
  caption: string;
  postType: string;
  mediaUrls: string;
  tags: string | null;
  createdAt: string | Date;
  author: {
    id: string;
    displayName: string;
    username: string;
    avatar: string | null;
    isVerifiedDesigner: boolean;
  };
  likes: { userId: string }[];
  comments: {
    id: string;
    authorId: string;
    content: string;
    createdAt: string | Date;
    author: {
      displayName: string;
      username: string;
      avatar: string | null;
    };
  }[];
  linkedProduct?: {
    id: string;
    title: string;
    price: number;
    currency: string;
  } | null;
}

interface FeedClientProps {
  initialPosts: PostItem[];
  currentUserId?: string;
  availableProducts?: { id: string; title: string }[];
}

export function FeedClient({
  initialPosts,
  currentUserId,
  availableProducts = [],
}: FeedClientProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<"DISCOVER" | "FOLLOWING">("DISCOVER");
  const [explorationMode, setExplorationMode] = useState<"BALANCED" | "FAMILIAR" | "ADVENTUROUS">("BALANCED");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // New Post Dialog
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [postType, setPostType] = useState("OUTFIT");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [linkedProduct, setLinkedProduct] = useState("");
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comments State (expanded post id)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);

  // Report Modal
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportCategory, setReportCategory] = useState("STOLEN_DESIGN");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Saved feedback
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  const handleLike = async (postId: string) => {
    if (!currentUserId) {
      alert("Please sign in or select a member demo role to like posts.");
      return;
    }

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.likes.some((l) => l.userId === currentUserId);
          const newLikes = isLiked
            ? p.likes.filter((l) => l.userId !== currentUserId)
            : [...p.likes, { userId: currentUserId }];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (postId: string) => {
    if (!currentUserId) {
      alert("Please sign in or select a member demo role to save content.");
      return;
    }

    const nextState = !savedPosts[postId];
    setSavedPosts((prev) => ({ ...prev, [postId]: nextState }));

    try {
      await fetch(`/api/posts/${postId}/save`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setSubmittingComment(postId);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                comments: [...p.comments, data.comment],
              };
            }
            return p;
          })
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingComment(null);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption || !imageUrl) return;

    setSubmittingPost(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          postType,
          mediaUrls: [imageUrl],
          tags,
          linkedProductId: linkedProduct || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts([
          {
            ...data.post,
            likes: [],
            comments: [],
          },
          ...posts,
        ]);
        setNewPostOpen(false);
        setCaption("");
        setImageUrl("");
        setTags("");
        setLinkedProduct("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPostId || !reportReason) return;

    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "POST",
          targetId: reportingPostId,
          category: reportCategory,
          reason: reportReason,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportingPostId(null);
        setReportSubmitted(false);
        setReportReason("");
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (selectedTag && (!p.tags || !p.tags.toLowerCase().includes(selectedTag.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Feed Controls Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7E1DB] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Feed Type Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("DISCOVER")}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
              activeTab === "DISCOVER"
                ? "bg-[#252321] text-white"
                : "bg-[#F8F5F0] text-[#77716D] hover:text-[#252321]"
            }`}
          >
            Discover Feed
          </button>
          <button
            onClick={() => setActiveTab("FOLLOWING")}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
              activeTab === "FOLLOWING"
                ? "bg-[#252321] text-white"
                : "bg-[#F8F5F0] text-[#77716D] hover:text-[#252321]"
            }`}
          >
            Following
          </button>
        </div>

        {/* Recommendation Exploration Control */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#77716D] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Exploration:
          </span>
          {(["FAMILIAR", "BALANCED", "ADVENTUROUS"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setExplorationMode(mode)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                explorationMode === mode
                  ? "bg-[#FBECEE] text-[#791D29] border border-[#A92735]/30 font-semibold"
                  : "text-[#77716D] hover:bg-[#F8F5F0]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Publish Button */}
        <button
          onClick={() => setNewPostOpen(true)}
          className="px-4 py-2 bg-[#A92735] hover:bg-[#791D29] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Publish Entry
        </button>
      </div>

      {/* Aesthetic Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-[#77716D] uppercase tracking-wider mr-1">
          Aesthetic Filter:
        </span>
        {["All", "Streetwear", "Avant-Garde", "Modular", "Upcycled", "Archive"].map((tag) => {
          const isAll = tag === "All";
          const isSelected = isAll ? selectedTag === null : selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(isAll ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                isSelected
                  ? "bg-[#252321] text-white border-[#252321]"
                  : "bg-white text-[#252321] border-[#E7E1DB] hover:border-[#A92735]"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Posts Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => {
          const mediaList: string[] = JSON.parse(post.mediaUrls || "[]");
          const isLiked = currentUserId ? post.likes.some((l) => l.userId === currentUserId) : false;
          const isSaved = savedPosts[post.id];
          const areCommentsOpen = expandedComments[post.id];

          return (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-[#E7E1DB] overflow-hidden flex flex-col shadow-card hover:border-[#D1C8BF] transition-all"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-[#F4F1EC]">
                <Link href={`/designers/${post.author.id}`} className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={post.author.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-[#E7E1DB]"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-[#252321] hover:text-[#A92735] transition-colors leading-none">
                        {post.author.displayName}
                      </h4>
                      {post.author.isVerifiedDesigner && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A92735]" title="Verified Designer" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#77716D] mt-0.5">@{post.author.username}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#F8F5F0] text-[#77716D]">
                    {post.postType}
                  </span>
                  <button
                    onClick={() => setReportingPostId(post.id)}
                    className="text-[#A49E99] hover:text-[#791D29] p-1"
                    title="Report Content"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary Image */}
              <div className="relative aspect-[4/5] bg-[#EFE9E0] overflow-hidden">
                <img
                  src={mediaList[0] || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {post.linkedProduct && (
                  <Link
                    href={`/marketplace/${post.linkedProduct.id}`}
                    className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-lg border border-white/40 flex items-center justify-between text-xs hover:bg-white transition-colors"
                  >
                    <span className="font-semibold text-[#252321] truncate max-w-[200px]">
                      Tagged: {post.linkedProduct.title}
                    </span>
                    <span className="font-bold text-[#A92735]">
                      {formatPrice(post.linkedProduct.price, post.linkedProduct.currency)}
                    </span>
                  </Link>
                )}
              </div>

              {/* Interaction Bar */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[#252321] leading-relaxed mb-2">{post.caption}</p>
                  {post.tags && (
                    <p className="text-[11px] text-[#A92735] font-medium">{post.tags}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#F4F1EC] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#77716D]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 p-1 rounded transition-colors ${
                          isLiked ? "text-[#A92735] font-semibold" : "hover:text-[#252321]"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-[#A92735]" : ""}`} />
                        <span>{post.likes.length}</span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 p-1 rounded hover:text-[#252321] transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleSave(post.id)}
                      className={`p-1 transition-colors ${
                        isSaved ? "text-[#A92735]" : "hover:text-[#252321]"
                      }`}
                      title={isSaved ? "Saved" : "Save to collections"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#A92735]" : ""}`} />
                    </button>
                  </div>

                  {/* Comments Accordion */}
                  {areCommentsOpen && (
                    <div className="pt-2 border-t border-[#F4F1EC] space-y-3 text-xs animate-in fade-in">
                      <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                        {post.comments.length === 0 ? (
                          <p className="text-[#A49E99] text-[11px] italic">
                            No comments yet. Start the dialogue.
                          </p>
                        ) : (
                          post.comments.map((c) => (
                            <div key={c.id} className="bg-[#FAF7F2] p-2 rounded-lg">
                              <span className="font-bold text-[#252321] mr-1.5">
                                @{c.author.username}:
                              </span>
                              <span className="text-[#252321]">{c.content}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add thoughtful commentary..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
                          }}
                          className="flex-1 bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg px-2.5 py-1.5 text-xs text-[#252321] focus:outline-none focus:border-[#A92735]"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={submittingComment === post.id}
                          className="p-1.5 bg-[#252321] text-white rounded-lg hover:bg-[#A92735] transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* New Post Dialog */}
      {newPostOpen && (
        <div className="fixed inset-0 z-50 bg-[#252321]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-[#E7E1DB] p-6 shadow-editorial space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
              <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                Publish Editorial Entry
              </h3>
              <button
                onClick={() => setNewPostOpen(false)}
                className="p-1 text-[#77716D] hover:text-[#252321]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  Post Classification
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                >
                  <option value="OUTFIT">Outfit / Styling Record</option>
                  <option value="CONCEPT">Design Concept & Sketch</option>
                  <option value="INSPIRATION">Textile & Mood Inspiration</option>
                  <option value="SHOWCASE">Designer Showcase</option>
                  <option value="COLLAB_ANNOUNCEMENT">Collaboration Announcement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  High-Resolution Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  Caption & Narrative *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the silhouette, textile origins, or construction technique..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252321] mb-1">
                  Hashtags & Aesthetics (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="#streetwear, #avantgarde, #upcycling"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                />
              </div>

              {availableProducts.length > 0 && (
                <div>
                  <label className="block font-semibold text-[#252321] mb-1">
                    Link Purchasable Product (Optional)
                  </label>
                  <select
                    value={linkedProduct}
                    onChange={(e) => setLinkedProduct(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                  >
                    <option value="">None (Pure editorial inspiration)</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewPostOpen(false)}
                  className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs font-semibold text-[#77716D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="px-5 py-2 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  {submittingPost ? "Publishing..." : "Publish to Feed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingPostId && (
        <div className="fixed inset-0 z-50 bg-[#252321]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#E7E1DB] p-6 shadow-editorial space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
              <h3 className="font-editorial text-xl font-bold text-[#791D29] flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-[#A92735]" /> Submit Moderation Report
              </h3>
              <button
                onClick={() => setReportingPostId(null)}
                className="p-1 text-[#77716D] hover:text-[#252321]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FBECEE] text-[#791D29] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#252321]">Report Recorded</h4>
                <p className="text-xs text-[#77716D]">
                  Our editorial moderation team will investigate evidence under our Community
                  Guidelines.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#252321] mb-1">
                    Violation Category
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                  >
                    <option value="STOLEN_DESIGN">Stolen Design / Uncredited Plagiarism</option>
                    <option value="HARASSMENT">Harassment or Defamatory Behavior</option>
                    <option value="SCAM">Commercial Fraud / Counterfeit</option>
                    <option value="INAPPROPRIATE">Inappropriate or Graphic Content</option>
                    <option value="MISLEADING">Misleading Production Claims</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#252321] mb-1">
                    Factual Explanation *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details and reference links for our curators to verify..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportingPostId(null)}
                    className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs font-semibold text-[#77716D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#791D29] hover:bg-[#5C161F] text-white rounded-full text-xs font-semibold uppercase tracking-wider"
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
