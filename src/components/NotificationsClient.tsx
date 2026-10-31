"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Sparkles,
  ShoppingBag,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: string;
  isRead: boolean;
  linkUrl: string | null;
  createdAt: string | Date;
}

interface NotificationsClientProps {
  initialNotifications: NotificationItem[];
}

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<string>("ALL");

  const filtered =
    filter === "ALL"
      ? notifications
      : notifications.filter((n) => n.category === filter);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/read", { method: "POST" });
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "COMMERCE":
        return <ShoppingBag className="w-4 h-4 text-[#A92735]" />;
      case "COLLAB":
        return <Users className="w-4 h-4 text-[#A92735]" />;
      case "SECURITY":
        return <ShieldCheck className="w-4 h-4 text-[#791D29]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#A92735]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {["ALL", "SOCIAL", "COMMERCE", "COLLAB", "SECURITY"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider transition-all ${
                filter === cat
                  ? "bg-[#252321] text-white"
                  : "bg-white text-[#77716D] border border-[#E7E1DB] hover:text-[#252321]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-[#A92735] font-semibold hover:underline self-end sm:self-auto"
          >
            Mark all ({unreadCount}) as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-[#E7E1DB] rounded-3xl overflow-hidden shadow-sm divide-y divide-[#F4F1EC]">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#77716D] space-y-2">
            <Bell className="w-6 h-6 mx-auto text-[#77716D]" />
            <p>No notifications in this category</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && handleMarkOneRead(item.id)}
              className={`p-5 transition-colors flex items-start gap-4 ${
                !item.isRead ? "bg-[#FBECEE]/20 hover:bg-[#FBECEE]/40" : "hover:bg-[#F8F5F0]/50"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#F8F5F0] border border-[#E7E1DB] flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(item.category)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-xs text-[#252321] flex items-center gap-2">
                    {item.title}
                    {!item.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A92735]" />
                    )}
                  </h4>
                  <span className="text-[10px] text-[#77716D] font-mono shrink-0">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-[#77716D] leading-relaxed">{item.body}</p>

                {item.linkUrl && (
                  <div className="pt-1.5">
                    <Link
                      href={item.linkUrl}
                      className="text-[11px] font-semibold text-[#A92735] hover:underline inline-flex items-center gap-1"
                    >
                      View details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

