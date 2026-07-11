// frontend/src/components/chat/FloatingChatWidget.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInbox, useConversation, useSendMessage, useUnreadCount } from "@/hooks/useMessages";
import { Avatar, Spinner } from "@/components/ui";
import { Mail, MessageCircle, X, ChevronLeft, Send, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { timeAgo, truncate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export default function FloatingChatWidget() {
  const { user: authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const containerRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // If user not logged in, do not render the floating chat widget
  if (!authUser) return null;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-[380px] h-[520px] max-h-[80vh] bg-white rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col mb-4 overflow-hidden animate-slideUp transition-all duration-300">
          {selectedPartner ? (
            <WidgetMessageThread
              partner={selectedPartner}
              onBack={() => setSelectedPartner(null)}
            />
          ) : (
            <WidgetInboxList
              onSelectPartner={(partner) => setSelectedPartner(partner)}
            />
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <WidgetTriggerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function WidgetTriggerButton({ isOpen, onClick }) {
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200",
        isOpen
          ? "bg-slate-800 hover:bg-slate-900"
          : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
      )}
    >
      {isOpen ? (
        <X size={24} className="animate-delay-100" />
      ) : (
        <MessageCircle size={24} />
      )}
      {unreadCount > 0 && !isOpen && (
        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-md">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INBOX LIST
// ─────────────────────────────────────────────────────────────────────────────
function WidgetInboxList({ onSelectPartner }) {
  const { data: inbox = [], isLoading, isError, refetch } = useInbox();

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
          <Mail size={18} className="text-teal-500" />
          Messages
        </h3>
        {inbox.length > 0 && (
          <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {inbox.length} chats
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-10">
            <Spinner className="text-teal-500 w-8 h-8" />
            <p className="text-slate-400 text-xs mt-2">Loading chats...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <ShieldAlert size={36} className="text-rose-400 mb-2" />
            <p className="text-sm text-slate-600 font-medium">Could not load chats</p>
            <button onClick={refetch} className="btn-secondary mt-3 text-xs py-1.5 px-3">
              Retry
            </button>
          </div>
        ) : inbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <MessageCircle size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No messages yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Explore listings and contact potential roommates or flat owners to start chatting.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {inbox.map((conv) => {
              const msg = conv.lastMessage;
              const partner = conv.user;
              const msgText = msg?.content || msg?.message || "";

              return (
                <button
                  key={conv._id}
                  onClick={() => onSelectPartner(partner)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all duration-150 text-left"
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={partner?.profileImage || partner?.avatar}
                      name={partner?.name}
                      size="md"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {partner?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {msg?.createdAt ? timeAgo(msg.createdAt) : ""}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs truncate",
                        conv.unreadCount > 0
                          ? "text-slate-900 font-semibold"
                          : "text-slate-500"
                      )}
                    >
                      {truncate(msgText, 45)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPACT MESSAGE THREAD
// ─────────────────────────────────────────────────────────────────────────────
function WidgetMessageThread({ partner, onBack }) {
  const { user: authUser } = useAuth();
  const bottomRef = useRef(null);
  const [content, setContent] = useState("");
  const { data: messages = [], isLoading, isError, refetch } = useConversation(partner._id);
  const sendMessageMutation = useSendMessage(partner._id);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || sendMessageMutation.isPending) return;

    const text = content.trim();
    setContent("");
    try {
      await sendMessageMutation.mutateAsync(text);
    } catch (_) {
      // toast handled in mutation
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-white border-b border-slate-100">
        <button
          onClick={onBack}
          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <Avatar
          src={partner?.profileImage || partner?.avatar}
          name={partner?.name}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 text-sm truncate leading-tight">
            {partner?.name}
          </h4>
          <span className="text-[10px] text-emerald-500 font-medium">Active</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="text-teal-500 w-6 h-6" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-xs text-rose-500">Could not load messages</p>
            <button onClick={refetch} className="btn-secondary text-[10px] py-1 px-2.5 mt-2">
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Say hello to {partner.name}!
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = String(msg.sender?._id || msg.sender) === String(authUser?._id);
            const msgContent = msg.content || msg.message || "";
            return (
              <div
                key={msg._id}
                className={cn("flex gap-2 items-end", isMine ? "flex-row-reverse" : "flex-row")}
              >
                {!isMine && (
                  <Avatar
                    src={partner?.profileImage || partner?.avatar}
                    name={partner?.name}
                    size="xs"
                    className="shrink-0 mb-0.5"
                  />
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                    isMine
                      ? "bg-teal-500 text-white rounded-br-sm shadow-sm"
                      : "bg-white border border-slate-200/80 text-slate-800 rounded-bl-sm shadow-sm",
                    msg._optimistic && "opacity-75"
                  )}
                >
                  <p>{msgContent}</p>
                  <span
                    className={cn(
                      "block text-[9px] mt-1 text-right",
                      isMine ? "text-teal-100" : "text-slate-400"
                    )}
                  >
                    {timeAgo(msg.createdAt)}
                    {msg._optimistic && " · Sending..."}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!content.trim() || sendMessageMutation.isPending}
            className="w-8 w-8 h-8 rounded-xl bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
