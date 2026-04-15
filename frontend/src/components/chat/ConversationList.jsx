// frontend/src/components/chat/ConversationList.jsx
import { Link, useParams } from "react-router-dom";
import { Avatar, Badge } from "@/components/ui";
import { InboxSkeleton } from "@/components/ui/Skeleton";
import { QueryError, EmptyState } from "@/components/ui/ErrorBoundary";
import { useInbox } from "@/hooks/useMessages";
import { timeAgo, truncate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export default function ConversationList() {
  const { userId: activeId } = useParams();
  const { data: inbox, isLoading, isError, refetch } = useInbox();

  if (isLoading) return <InboxSkeleton />;
  if (isError)   return <QueryError message="Could not load inbox." onRetry={refetch} />;
  if (!inbox?.length) return (
    <EmptyState
      title="No messages yet"
      description="Start a conversation by contacting a room listing owner."
    />
  );

  return (
    <div className="space-y-1">
      {inbox.map((conv) => {
        const msg     = conv.lastMessage;
        const partner = conv.partner;
        const isActive = String(partner?._id) === activeId;

        return (
          <Link
            key={conv._id}
            to={`/messages/${partner?._id}`}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl transition-all duration-150",
              isActive ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
            )}
          >
            <div className="relative flex-shrink-0">
              <Avatar src={partner?.avatar} name={partner?.name} size="md" />
              {conv.unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold text-gray-900 truncate">{partner?.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(msg.createdAt)}</span>
              </div>
              <p className={cn("text-xs truncate", conv.unreadCount > 0 ? "text-gray-800 font-medium" : "text-gray-500")}>
                {truncate(msg.content, 50)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
