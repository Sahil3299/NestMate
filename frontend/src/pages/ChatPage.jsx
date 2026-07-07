import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { userApi } from "../services/api";
import ConversationList from "../components/chat/ConversationList";
import MessageThread from "../components/chat/MessageThread";
import { Spinner } from "../components/ui";

export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { data: partner, isLoading: partnerLoading, isError: partnerError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApi.getPublicProfile(userId).then((r) => r.data.data),
    enabled: !!userId && !!user && userId !== user?._id,
    retry: false,
  });

  if (authLoading) {
    return (
      <div className="h-[calc(100vh-73px)] flex items-center justify-center bg-[#FAFAFA]">
        <Spinner className="text-teal-500 w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[calc(100vh-73px)] flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#0F172A] mb-2">Sign in to chat</h2>
          <p className="text-[#64748B] mb-4">You need to be logged in to send and receive messages.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const partnerName = partner?.name || (partnerLoading ? "Loading..." : "User");
  const partnerAvatar = partner?.profileImage || "";
  const partnerVerified = partner?.verified || false;

  return (
    <div className="h-[calc(100vh-73px)] flex bg-[#FAFAFA]">
      {/* Inbox Sidebar */}
      <div className="w-80 lg:w-96 border-r border-[#E2E8F0] bg-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-[#E2E8F0]">
          <h1 className="text-xl font-bold text-[#0F172A]">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {userId ? (
          partnerError ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <p className="text-[#64748B]">Could not load user information.</p>
              </div>
            </div>
          ) : (
            <MessageThread
              key={userId}
              partnerId={userId}
              partnerName={partnerName}
              partnerAvatar={partnerAvatar}
              partnerVerified={partnerVerified}
            />
          )
        ) : (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Your Messages</h2>
              <p className="text-sm text-[#64748B]">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
