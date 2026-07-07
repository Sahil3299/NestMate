import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem("accessToken") || localStorage.getItem("nestmate_token");

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket first.");
  }
  return socket;
};

export const joinChat = (withUid) => {
  if (!socket) return;
  socket.emit("join_chat", withUid);
};

export const sendMessage = (toUid, text) => {
  if (!socket) return;
  socket.emit("send_message", { toUid, text });
};

export const sendTyping = (withUid) => {
  if (!socket) return;
  socket.emit("typing", withUid);
};

export const sendStopTyping = (withUid) => {
  if (!socket) return;
  socket.emit("stop_typing", withUid);
};

export const onUserOnline = (callback) => {
  if (!socket) return;
  socket.on("user_online", callback);
  return () => socket.off("user_online", callback);
};

export const onUserOffline = (callback) => {
  if (!socket) return;
  socket.on("user_offline", callback);
  return () => socket.off("user_offline", callback);
};

export const onReceiveMessage = (callback) => {
  if (!socket) return;
  socket.on("receive_message", callback);
  return () => socket.off("receive_message", callback);
};

export const onUserTyping = (callback) => {
  if (!socket) return;
  socket.on("user_typing", callback);
  return () => socket.off("user_typing", callback);
};

export const onUserStopTyping = (callback) => {
  if (!socket) return;
  socket.on("user_stop_typing", callback);
  return () => socket.off("user_stop_typing", callback);
};

export const removeAllListeners = () => {
  if (!socket) return;
  socket.removeAllListeners();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
