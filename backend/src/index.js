const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const env = require("./config/env");
const createApp = require("./app");

const userSockets = new Map(); // Map of uid -> socket id

async function start() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");

  const app = createApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  // Socket.io middleware for authentication
  io.use((socket, next) => {
    const uid = socket.handshake.auth.uid;
    if (!uid) return next(new Error("Authentication failed"));
    socket.uid = uid;
    next();
  });

  // Socket.io event handlers
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.uid}`);

    // Store user socket
    userSockets.set(socket.uid, socket.id);
    io.emit("user_online", { uid: socket.uid, timestamp: new Date() });

    // Join private room for DMs
    socket.on("join_chat", (withUid) => {
      const roomName = [socket.uid, withUid].sort().join(":");
      socket.join(roomName);
      socket.currentChatRoom = roomName;
    });

    // Send message
    socket.on("send_message", async (data) => {
      const { toUid, text } = data;
      const roomName = [socket.uid, toUid].sort().join(":");

      const messageData = {
        senderUid: socket.uid,
        text,
        createdAt: new Date(),
      };

      // Emit to recipient
      io.to(roomName).emit("receive_message", messageData);
    });

    // Typing indicator
    socket.on("typing", (withUid) => {
      const roomName = [socket.uid, withUid].sort().join(":");
      socket.to(roomName).emit("user_typing", { uid: socket.uid });
    });

    socket.on("stop_typing", (withUid) => {
      const roomName = [socket.uid, withUid].sort().join(":");
      socket.to(roomName).emit("user_stop_typing", { uid: socket.uid });
    });

    // Disconnect
    socket.on("disconnect", () => {
      userSockets.delete(socket.uid);
      io.emit("user_offline", { uid: socket.uid, timestamp: new Date() });
      console.log(`User disconnected: ${socket.uid}`);
    });
  });

  server.listen(env.PORT, () => {
    console.log(`API + WebSocket listening on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});


