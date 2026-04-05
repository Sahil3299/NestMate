import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import {
  initSocket,
  getSocket,
  joinChat,
  sendMessage,
  sendTyping,
  sendStopTyping,
  onReceiveMessage,
  onUserTyping,
  onUserStopTyping,
  disconnectSocket,
} from "../lib/socket";
import Button from "../components/Button";
import Card from "../components/Card";

export default function ChatPage() {
  const navigate = useNavigate();
  const { uid } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const listRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const limit = 200;

  // Initialize Socket.io
  useEffect(() => {
    if (!user) return;

    try {
      initSocket(user.uid);
      const socket = getSocket();

      // Update online status
      setIsOnline(socket.connected);

      socket.on("connect", () => setIsOnline(true));
      socket.on("disconnect", () => setIsOnline(false));

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    } catch (err) {
      console.error("Socket initialization error:", err);
    }
  }, [user]);

  // Load initial messages
  async function loadMessages() {
    if (!uid) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/messages/${uid}`, { params: { limit } });
      setMessages(res.data.messages || []);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  // Join chat room and setup real-time listeners
  useEffect(() => {
    if (!uid || !user) return;

    try {
      const socket = getSocket();
      joinChat(uid);

      // Listen for incoming messages
      const unsubReceive = onReceiveMessage((messageData) => {
        setMessages((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            ...messageData,
          },
        ]);
      });

      // Listen for typing indicators
      const unsubTyping = onUserTyping((data) => {
        if (data.uid === uid) {
          setIsTyping(true);
        }
      });

      const unsubStopTyping = onUserStopTyping((data) => {
        if (data.uid === uid) {
          setIsTyping(false);
        }
      });

      return () => {
        unsubReceive?.();
        unsubTyping?.();
        unsubStopTyping?.();
      };
    } catch (err) {
      console.error("Chat setup error:", err);
    }
  }, [uid, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Handle typing indicator
  const handleTextChange = (value) => {
    setText(value);

    if (!isTyping) {
      setIsTyping(true);
      sendTyping(uid);
    }

    // Debounce stop typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendStopTyping(uid);
    }, 1000);
  };

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text.trim();
    setSending(true);
    setError("");
    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      // Send via Socket.io (real-time)
      sendMessage(uid, messageText);

      // Also save to database via REST API
      await api.post("/api/messages", {
        toUid: uid,
        text: messageText,
      });

      setText("");
      sendStopTyping(uid);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  const onlineStatus = (
    <div className={`flex items-center gap-1 text-xs ${isOnline ? "text-green-600" : "text-gray-500"}`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-600 animate-pulse" : "bg-gray-400"}`}></div>
      {isOnline ? "Online" : "Offline"}
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)] space-y-4">
        {/* Header */}
        <Card className="space-y-4 shadow-md border-b-2 border-primary-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                disconnectSocket();
                navigate("/matches");
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Chat</h2>
              <p className="text-xs text-gray-500">with {uid?.slice(0, 8)}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className={`w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold`}>
                {uid?.charAt(0).toUpperCase()}
              </div>
              {onlineStatus}
            </div>
          </div>
        </Card>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {error && (
            <div className="bg-red-50 border-b border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div
            ref={listRef}
            className="h-full overflow-y-auto p-6 space-y-6 flex flex-col"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading messages...</p>
                </div>
              </div>
            ) : !loading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="text-4xl">💬</div>
                  <p className="text-gray-600 font-medium">Start the conversation!</p>
                  <p className="text-sm text-gray-500">Send your first message to introduce yourself</p>
                </div>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = user && m.senderUid === user.uid;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} animate-slideIn`}
                  >
                    <div className={`flex gap-3 max-w-xl ${isMe ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${
                          isMe
                            ? "bg-gradient-to-br from-primary-600 to-primary-500"
                            : "bg-gradient-to-br from-accent-600 to-accent-500"
                        }`}
                      >
                        {isMe ? user?.email?.charAt(0).toUpperCase() : m.senderUid?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`space-y-1 ${isMe ? "items-end flex flex-col" : ""}`}>
                        <p className="text-xs text-gray-500 px-3">
                          {isMe ? "You" : m.senderUid?.slice(0, 8)}
                        </p>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm break-words ${
                            isMe
                              ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-none shadow-md"
                              : "bg-gray-100 text-gray-900 rounded-bl-none"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-slideIn">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br from-accent-600 to-accent-500">
                    {uid?.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="rounded-2xl px-4 py-3 bg-gray-100">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="space-y-3">
          <div className="flex gap-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <input
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
            />
            <Button
              type="submit"
              disabled={sending || !text.trim()}
              variant="primary"
              size="sm"
              className="flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
          {sending && <p className="text-xs text-gray-500 text-center">Sending...</p>}
        </form>
      </div>
    </div>
  );
}

