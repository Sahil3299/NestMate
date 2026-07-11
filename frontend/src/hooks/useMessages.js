// frontend/src/hooks/useMessages.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/Toast";

export const MESSAGE_KEYS = {
  inbox:        ["messages", "inbox"],
  conversation: (userId) => ["messages", "conversation", userId],
  unread:       ["messages", "unread"],
};

export const useInbox = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: MESSAGE_KEYS.inbox,
    queryFn:  () =>
      messageApi.getInbox().then((r) =>
        (r.data.data || []).map((conv) => ({
          ...conv,
          user: conv.participants?.find((p) => String(p._id) !== String(user?._id)) || conv.participants?.[0],
          unreadCount: conv.unreadCount || 0,
        }))
      ),
    refetchInterval: 30_000,
  });
};

export const useConversation = (userId) =>
  useQuery({
    queryKey: MESSAGE_KEYS.conversation(userId),
    queryFn:  () =>
      messageApi.getConversation(userId).then((r) =>
        (r.data.data || []).map((msg) => ({
          ...msg,
          content: msg.content || msg.message,
        }))
      ),
    enabled:  !!userId,
    refetchInterval: 10_000,
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: MESSAGE_KEYS.unread,
    queryFn:  () => messageApi.getUnreadCount().then((r) => r.data.data.count),
    refetchInterval: 15_000,
  });

// ── Send message with optimistic UI ───────────────────────────────────────
export const useSendMessage = (receiverId) => {
  const queryClient = useQueryClient();
  const { user }    = useAuth();

  return useMutation({
    mutationFn: (content) =>
      messageApi.send({ receiverId, content }).then((r) => r.data.data),

    onMutate: async (content) => {
      const qKey = MESSAGE_KEYS.conversation(receiverId);
      await queryClient.cancelQueries({ queryKey: qKey });

      const previous = queryClient.getQueryData(qKey);

      // Optimistically append the message
      const optimistic = {
        _id:       `optimistic-${Date.now()}`,
        content,
        sender:    { _id: user._id, name: user.name, profileImage: user.profileImage },
        receiver:  { _id: receiverId },
        createdAt: new Date().toISOString(),
        isRead:    false,
        _optimistic: true,
      };

      queryClient.setQueryData(qKey, (old = []) => [...old, optimistic]);
      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(MESSAGE_KEYS.conversation(receiverId), ctx.previous);
      }
      toast.error("Failed to send message. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.conversation(receiverId) });
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.inbox });
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.unread });
    },
  });
};
