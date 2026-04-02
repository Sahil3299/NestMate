import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function ChatPage() {
  const navigate = useNavigate();
  const { withUid } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  const listRef = useRef(null);

  const limit = 200;

  async function loadMessages() {
    if (!withUid) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/messages/${withUid}`, { params: { limit } });
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
  }, [withUid]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError("");
    try {
      await api.post("/api/messages", {
        toUid: withUid,
        text: text.trim(),
      });
      setText("");
      await loadMessages();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  const title = useMemo(() => (withUid ? `Chat with ${withUid}` : "Chat"), [withUid]);

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => navigate("/matches")} className="text-sm underline">
            Back to matches
          </button>
          <div className="font-semibold">{title}</div>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="border rounded-xl bg-white/90">
          <div
            ref={listRef}
            className="h-[60vh] overflow-y-auto p-4 space-y-2"
          >
            {loading ? <div className="text-sm text-gray-600">Loading messages...</div> : null}

            {!loading && messages.length === 0 ? (
              <div className="text-sm text-gray-600">No messages yet.</div>
            ) : null}

            {messages.map((m) => {
              const isMe = user && m.senderUid === user.uid;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm border ${
                      isMe ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-800"
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">{m.senderUid}</div>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

