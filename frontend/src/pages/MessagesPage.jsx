// frontend/src/pages/MessagesPage.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/api";
import ConversationList from "@/components/chat/ConversationList";
import MessageThread from "@/components/chat/MessageThread";

export default function MessagesPage() {
  const { userId } = useParams();

  const { data: partner } = useQuery({
    queryKey: ["user", "public", userId],
    queryFn:  () => userApi.getPublicProfile(userId).then((r) => r.data.data),
    enabled:  !!userId,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="card overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-full sm:w-72 lg:w-80 border-r border-gray-100 overflow-y-auto flex-shrink-0 p-3">
            <ConversationList />
          </div>

          {/* Thread */}
          <div className="flex-1 overflow-hidden">
            {userId ? (
              <MessageThread
                partnerId={userId}
                partnerName={partner?.name}
                partnerAvatar={partner?.avatar}
                partnerVerified={partner?.isVerified}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Select a conversation</p>
                <p className="text-gray-400 text-sm mt-1">Choose from your inbox to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
