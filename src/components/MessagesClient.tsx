"use client";

import { useState } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Plus,
  Clock,
  User,
} from "lucide-react";

interface MessagesClientProps {
  currentUserId: string;
  initialConversations: any[];
  availableDesigners: any[];
}

export function MessagesClient({
  currentUserId,
  initialConversations,
  availableDesigners,
}: MessagesClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversations.length > 0 ? initialConversations[0].id : null
  );
  const [tab, setTab] = useState<"active" | "requests">("active");
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [initialMsgText, setInitialMsgText] = useState("");

  const activeConversations = conversations.filter((c) => c.status === "ACCEPTED");
  const requestConversations = conversations.filter((c) => c.status === "REQUEST_PENDING");

  const currentChat = conversations.find((c) => c.id === selectedId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending || !selectedId) return;
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedId, content: inputText }),
      });

      if (res.ok) {
        const { message } = await res.json();
        setConversations(
          conversations.map((c) =>
            c.id === selectedId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                }
              : c
          )
        );
        setInputText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleRequestAction = async (conversationId: string, action: "ACCEPT" | "DECLINE") => {
    try {
      const res = await fetch("/api/messages/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, action }),
      });

      if (res.ok) {
        const nextStatus = action === "ACCEPT" ? "ACCEPTED" : "DECLINED";
        setConversations(
          conversations.map((c) =>
            c.id === conversationId ? { ...c, status: nextStatus } : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipientId) return;

    try {
      const res = await fetch("/api/messages/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "START",
          recipientId: selectedRecipientId,
          initialMessage: initialMsgText || "Hello! Inquiring regarding your recent work on OFFFORM.",
        }),
      });

      if (res.ok) {
        const { conversation } = await res.json();
        const recipient = availableDesigners.find((d) => d.id === selectedRecipientId);
        const newEnriched = {
          ...conversation,
          otherParticipant: recipient || {
            displayName: "Designer",
            username: "designer",
            avatar: null,
          },
          messages: initialMsgText
            ? [{ id: "temp", content: initialMsgText, senderId: currentUserId, createdAt: new Date() }]
            : [],
        };
        setConversations([newEnriched, ...conversations]);
        setSelectedId(conversation.id);
        setNewChatModalOpen(false);
        setInitialMsgText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-[#E7E1DB] rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
      {/* Left Conversations Sidebar */}
      <div className="md:col-span-4 border-r border-[#E7E1DB] flex flex-col justify-between">
        <div>
          {/* Header & New Chat Button */}
          <div className="p-4 border-b border-[#F4F1EC] flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("active")}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  tab === "active" ? "bg-[#252321] text-white" : "text-[#77716D] hover:bg-[#F8F5F0]"
                }`}
              >
                Chats ({activeConversations.length})
              </button>
              <button
                onClick={() => setTab("requests")}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  tab === "requests" ? "bg-[#252321] text-white" : "text-[#77716D] hover:bg-[#F8F5F0]"
                }`}
              >
                Requests ({requestConversations.length})
              </button>
            </div>

            <button
              onClick={() => setNewChatModalOpen(true)}
              aria-label="New inquiry"
              className="p-1.5 bg-[#F8F5F0] hover:bg-[#A92735] hover:text-white rounded-full transition-colors text-[#252321]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* List of Conversations */}
          <div className="divide-y divide-[#F4F1EC] overflow-y-auto max-h-[520px]">
            {(tab === "active" ? activeConversations : requestConversations).length === 0 ? (
              <div className="p-8 text-center text-xs text-[#77716D] space-y-2">
                <MessageSquare className="w-6 h-6 mx-auto text-[#77716D]" />
                <p>No {tab === "active" ? "active conversations" : "message requests"}</p>
                <button
                  onClick={() => setNewChatModalOpen(true)}
                  className="text-[#A92735] font-semibold hover:underline"
                >
                  Start an inquiry →
                </button>
              </div>
            ) : (
              (tab === "active" ? activeConversations : requestConversations).map((c) => {
                const isSelected = c.id === selectedId;
                const lastMsg = c.messages[c.messages.length - 1];

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                      isSelected ? "bg-[#F8F5F0]" : "hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <img
                      src={
                        c.otherParticipant?.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={c.otherParticipant?.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E7E1DB] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#252321] truncate">
                          {c.otherParticipant?.displayName}
                        </span>
                        <span className="text-[10px] text-[#77716D]">
                          {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#77716D] truncate mt-0.5">
                        {lastMsg?.content || "Inquiry initiated"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="p-3 bg-[#FAF8F5] border-t border-[#E7E1DB] text-[10px] text-[#77716D] flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A92735] shrink-0" />
          <span>Encrypted routing & anti-abuse protections active.</span>
        </div>
      </div>

      {/* Right Chat Pane */}
      <div className="md:col-span-8 flex flex-col justify-between bg-[#FCFAF7]/40">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[#E7E1DB] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentChat.otherParticipant?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  }
                  alt={currentChat.otherParticipant?.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-[#E7E1DB]"
                />
                <div>
                  <h3 className="font-editorial text-lg font-semibold text-[#252321] leading-none">
                    {currentChat.otherParticipant?.displayName}
                  </h3>
                  <span className="text-[11px] text-[#77716D]">
                    @{currentChat.otherParticipant?.username}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase bg-[#F8F5F0] border border-[#E7E1DB] px-2 py-0.5 rounded text-[#77716D]">
                {currentChat.status}
              </span>
            </div>

            {/* Request Pending Notice (if recipient has not accepted yet) */}
            {currentChat.status === "REQUEST_PENDING" && currentChat.participant2Id === currentUserId && (
              <div className="p-4 bg-[#FBECEE] border-b border-[#A92735]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-[#791D29]">
                  <p className="font-semibold">Message Request</p>
                  <p>Accept this inquiry to open standard 2-way conversation.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequestAction(currentChat.id, "DECLINE")}
                    className="px-3 py-1 bg-white border border-[#E7E1DB] rounded-full text-xs text-[#77716D] hover:bg-[#F8F5F0]"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleRequestAction(currentChat.id, "ACCEPT")}
                    className="px-4 py-1 bg-[#252321] text-white rounded-full text-xs font-semibold hover:bg-[#A92735]"
                  >
                    Accept Inquiry
                  </button>
                </div>
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[440px]">
              {currentChat.messages.map((m: any) => {
                const isMine = m.senderId === currentUserId;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMine
                          ? "bg-[#252321] text-white rounded-tr-sm"
                          : "bg-white border border-[#E7E1DB] text-[#252321] rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[10px] text-[#77716D] mt-1 font-mono">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-[#E7E1DB] flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Compose message..."
                disabled={currentChat.status === "REQUEST_PENDING" && currentChat.participant2Id === currentUserId}
                className="flex-1 px-4 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs text-[#252321] focus:outline-none focus:border-[#A92735] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="px-4 py-2.5 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="p-16 text-center text-xs text-[#77716D] m-auto space-y-3">
            <MessageSquare className="w-8 h-8 mx-auto text-[#77716D]" />
            <p className="font-editorial text-xl text-[#252321]">
              Select an inquiry to view conversation
            </p>
          </div>
        )}
      </div>

      {/* NEW INQUIRY MODAL */}
      {newChatModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E1DB] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
              <h3 className="font-editorial text-2xl text-[#252321]">
                Initiate Creative Inquiry
              </h3>
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="p-1 text-[#77716D] hover:bg-[#F8F5F0] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartNewChat} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252321] uppercase tracking-wider mb-1">
                  Select Creator or Designer
                </label>
                <select
                  required
                  value={selectedRecipientId}
                  onChange={(e) => setSelectedRecipientId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                >
                  <option value="">-- Choose recipient --</option>
                  {availableDesigners.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.displayName} (@{d.username}) · {d.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#252321] uppercase tracking-wider mb-1">
                  Inquiry Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={initialMsgText}
                  onChange={(e) => setInitialMsgText(e.target.value)}
                  placeholder="Introduce yourself and outline your project or garment inquiry..."
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F4F1EC]">
                <button
                  type="button"
                  onClick={() => setNewChatModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs text-[#77716D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedRecipientId}
                  className="px-5 py-2 bg-[#252321] text-white hover:bg-[#A92735] rounded-full text-xs font-semibold disabled:opacity-50"
                >
                  Send Inquiry Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

