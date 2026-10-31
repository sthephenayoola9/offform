"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import {
  User,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Package,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Check,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface ProfileClientProps {
  user: any;
  posts: any[];
  orders: any[];
  policyAcceptances: any[];
}

export function ProfileClient({
  user: initialUser,
  posts,
  orders,
  policyAcceptances,
}: ProfileClientProps) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState<"posts" | "orders" | "privacy">("posts");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit form state
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || "");
  const [location, setLocation] = useState(user.location || "");
  const [aestheticTags, setAestheticTags] = useState(user.aestheticTags || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio, location, aestheticTags, avatar }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/users/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Deactivation failed");
      }

      window.location.href = "/";
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="bg-white border border-[#E7E1DB] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={
                user.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              }
              alt={user.displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#E7E1DB] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-editorial text-3xl font-semibold text-[#252321]">
                  {user.displayName}
                </h1>
                {user.isVerifiedDesigner && (
                  <span className="badge-verified-designer text-[11px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Designer
                  </span>
                )}
                {user.isApprovedSeller && (
                  <span className="badge-approved-seller text-[11px] px-2 py-0.5 rounded-full font-medium">
                    Atelier Seller
                  </span>
                )}
              </div>
              <p className="text-xs text-[#77716D] mt-0.5">@{user.username} · Member since {new Date(user.createdAt).getFullYear()}</p>

              {user.location && (
                <p className="text-xs text-[#77716D] flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3 h-3 text-[#A92735]" /> {user.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-4 py-2 border border-[#E7E1DB] text-[#252321] hover:border-[#252321] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" /> Edit Profile
            </button>
            {user.role === "SELLER" && (
              <Link
                href="/seller"
                className="px-4 py-2 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Studio Workspace
              </Link>
            )}
          </div>
        </div>

        {/* Bio & Aesthetic Tags */}
        <div className="pt-4 border-t border-[#F4F1EC] space-y-3">
          <p className="text-xs text-[#252321] leading-relaxed max-w-2xl whitespace-pre-line">
            {user.bio || "No creative bio published yet. Click Edit Profile to tell the community about your style."}
          </p>

          {user.aestheticTags && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.aestheticTags.split(",").map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F8F5F0] text-[#77716D] border border-[#E7E1DB]"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7E1DB] space-x-8">
        <button
          onClick={() => setActiveTab("posts")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "posts"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Posts & Looks ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "orders"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Purchases ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "privacy"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Governance</span>
        </button>
      </div>

      {/* 1. POSTS TAB */}
      {activeTab === "posts" && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="p-16 bg-white border border-[#E7E1DB] rounded-3xl text-center space-y-3 shadow-sm">
              <Layers className="w-8 h-8 text-[#77716D] mx-auto" />
              <p className="font-editorial text-2xl text-[#252321]">
                No community posts published yet
              </p>
              <p className="text-xs text-[#77716D] max-w-sm mx-auto leading-relaxed">
                Share an outfit post, architectural garment concept, or editorial styling lookbook on the Discover feed.
              </p>
              <div className="pt-2">
                <Link
                  href="/discover"
                  className="px-5 py-2.5 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  Create Look on Feed <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                let images = [];
                try {
                  images = JSON.parse(post.mediaUrls);
                } catch (e) {
                  images = [post.mediaUrls];
                }

                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="group bg-white border border-[#E7E1DB] rounded-2xl overflow-hidden shadow-sm hover:border-[#252321] transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[4/5] bg-[#F8F5F0] overflow-hidden">
                      <img
                        src={images[0]}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] uppercase font-mono text-[#77716D]">
                        {post.postType}
                      </span>
                      <p className="text-xs text-[#77716D] line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="p-16 bg-white border border-[#E7E1DB] rounded-3xl text-center space-y-3 shadow-sm">
              <Package className="w-8 h-8 text-[#77716D] mx-auto" />
              <p className="font-editorial text-2xl text-[#252321]">
                No orders placed yet
              </p>
              <p className="text-xs text-[#77716D] max-w-sm mx-auto leading-relaxed">
                When you purchase garments from independent designers on OFFFORM, your tracking and status appear here.
              </p>
              <div className="pt-2">
                <Link
                  href="/marketplace"
                  className="px-5 py-2.5 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  Explore Marketplace
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4F1EC] pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#77716D] uppercase">
                        Order #{order.id.slice(-8)}
                      </span>
                      <h3 className="font-editorial text-xl font-semibold text-[#252321]">
                        Designer: {order.seller.displayName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-editorial text-xl font-bold text-[#252321]">
                        {formatPrice(order.totalAmount, order.currency)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-[#FBECEE] text-[#791D29]">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs p-3 bg-[#F8F5F0] rounded-xl border border-[#E7E1DB]"
                    >
                      <div>
                        <p className="font-semibold text-[#252321]">{item.product.title}</p>
                        {item.customisationSummary && (
                          <p className="text-[11px] text-[#A92735]">
                            Config: {item.customisationSummary}
                          </p>
                        )}
                      </div>
                      <span className="font-mono">{formatPrice(item.unitPrice, order.currency)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PRIVACY & GOVERNANCE TAB */}
      {activeTab === "privacy" && (
        <div className="space-y-8">
          {/* Policy Acceptance Records */}
          <div className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-editorial text-2xl text-[#252321]">
              Accepted Policy Versions (Section 24)
            </h3>
            <p className="text-xs text-[#77716D] leading-relaxed">
              OFFFORM cryptographically records your acceptance of platform terms to ensure legal
              transparency and creator rights protection.
            </p>

            <div className="divide-y divide-[#F4F1EC] border-t border-[#F4F1EC]">
              {policyAcceptances.map((acc) => (
                <div key={acc.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#252321]">{acc.policyType} Policy</span>
                    <span className="text-[11px] text-[#77716D] ml-2">Version {acc.version}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#77716D]">
                    Accepted: {new Date(acc.acceptedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="bg-white border border-[#791D29]/30 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#791D29]">
              <ShieldAlert className="w-4 h-4 text-[#A92735]" /> Account Deactivation & Data Rights (Section 25)
            </div>
            <p className="text-xs text-[#77716D] leading-relaxed">
              You may request complete account deactivation at any time. Your public profile will be
              promptly anonymised. Per statutory obligations, transaction histories required for taxation
              and dispute resolution are preserved under established retention schedules.
            </p>

            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-4 py-2 border border-[#791D29]/40 text-[#791D29] hover:bg-[#FBECEE] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Request Account Deactivation
            </button>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E1DB] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
              <h3 className="font-editorial text-2xl text-[#252321]">Edit Creator Profile</h3>
              <button onClick={() => setEditModalOpen(false)} className="p-1 rounded-full text-[#77716D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">General Location (City / Region)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Berlin, Germany or Tokyo, Japan"
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
                <span className="text-[10px] text-[#77716D]">Precise address is never shown publicly.</span>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">Aesthetic Tags</label>
                <input
                  type="text"
                  value={aestheticTags}
                  onChange={(e) => setAestheticTags(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F4F1EC]">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs text-[#77716D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 bg-[#252321] text-white hover:bg-[#A92735] rounded-full text-xs font-semibold disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACCOUNT DEACTIVATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E1DB] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#791D29]">
              <AlertTriangle className="w-5 h-5 text-[#A92735]" />
              <h3 className="font-editorial text-2xl text-[#252321]">
                Confirm Account Deactivation
              </h3>
            </div>

            <p className="text-xs text-[#77716D] leading-relaxed">
              To proceed with deactivation, please type{" "}
              <strong className="text-[#252321] font-mono">DELETE MY OFFFORM ACCOUNT</strong> below.
              Your public credentials will be immediately severed.
            </p>

            {deleteError && (
              <div className="p-3 bg-[#FBECEE] text-[#791D29] rounded-xl text-xs">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4 text-xs">
              <input
                type="text"
                required
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE MY OFFFORM ACCOUNT"
                className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs font-mono"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F4F1EC]">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs text-[#77716D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading || deleteConfirmation !== "DELETE MY OFFFORM ACCOUNT"}
                  className="px-5 py-2 bg-[#A92735] text-white hover:bg-[#791D29] rounded-full text-xs font-semibold disabled:opacity-50"
                >
                  {deleteLoading ? "Processing..." : "Confirm Deactivation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

