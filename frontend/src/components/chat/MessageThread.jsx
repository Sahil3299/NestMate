// frontend/src/components/chat/MessageThread.jsx
import { useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useConversation, useSendMessage, MESSAGE_KEYS } from "@/hooks/useMessages";
import { Avatar, Spinner, VerifiedBadge } from "@/components/ui";
import { QueryError } from "@/components/ui/ErrorBoundary";
import { messageSchema } from "@/validators/schemas";
import { timeAgo } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { joinChat, onReceiveMessage, getSocket } from "@/lib/socket";

export default function MessageThread({ partnerId, partnerName, partnerAvatar, partnerVerified }) {
  const { user }    = useAuth();
  const queryClient = useQueryClient();
  const bottomRef   = useRef(null);
  const { data: messages = [], isLoading, isError, refetch } = useConversation(partnerId);
  const sendMessage = useSendMessage(partnerId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(messageSchema),
  });

  useEffect(() => {
    if (!partnerId) return;
    try { joinChat(partnerId); } catch (e) { /* socket not ready */ }
  }, [partnerId]);

  const handleReceiveMessage = useCallback((msg) => {
    const senderId = msg.sender?._id || msg.sender;
    const receiverId = msg.receiver?._id || msg.receiver;
    const isRelevant = String(senderId) === String(partnerId) || String(receiverId) === String(partnerId);
    if (!isRelevant) return;

    queryClient.setQueryData(MESSAGE_KEYS.conversation(partnerId), (old = []) => {
      if (old.some((m) => m._id === msg._id)) return old;
      return [...old, { ...msg, content: msg.content || msg.message }];
    });
  }, [partnerId, queryClient]);

  useEffect(() => {
    if (!partnerId) return;
    const cleanup = onReceiveMessage(handleReceiveMessage);
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [partnerId, handleReceiveMessage]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const onSubmit = async ({ content }) => {
    await sendMessage.mutateAsync(content);
    reset();
  };

  if (isError) return <QueryError message="Could not load conversation." onRetry={refetch} />;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
        <Avatar src={partnerAvatar} name={partnerName} size="md" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{partnerName}</span>
            {partnerVerified && <VerifiedBadge />}
          </div>
          <span className="text-xs text-green-500 font-medium">Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="text-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Say hello to {partnerName}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = String(msg.sender?._id || msg.sender) === String(user?._id);
            const senderAvatar = msg.sender?.profileImage || msg.sender?.avatar;
            const msgContent = msg.content || msg.message || "";
            return (
              <div key={msg._id} className={cn("flex gap-2 items-end", isMine ? "flex-row-reverse" : "flex-row")}>
                {!isMine && <Avatar src={senderAvatar} name={msg.sender?.name} size="sm" className="flex-shrink-0 mb-1" />}
                <div className={cn(
                  "max-w-[72%] rounded-2xl px-4 py-2.5 text-sm",
                  isMine
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm",
                  msg._optimistic && "opacity-70"
                )}>
                  <p className="leading-relaxed">{msgContent}</p>
                  <p className={cn("text-xs mt-1", isMine ? "text-blue-200" : "text-gray-400")}>
                    {timeAgo(msg.createdAt)}
                    {msg._optimistic && " · Sending…"}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              {...register("content")}
              placeholder="Type a message…"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(onSubmit)(); }
              }}
              className="input resize-none overflow-hidden"
            />
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
          </div>
          <button type="submit" disabled={sendMessage.isPending} className="btn-primary px-4 py-2.5 flex-shrink-0">
            {sendMessage.isPending
              ? <Spinner className="w-4 h-4 text-white" />
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>}
          </button>
        </div>
      </form>
    </div>
  );
}
