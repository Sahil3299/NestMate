const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");

const env = require("./config/environment");
const createApp = require("./app");

// ═════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═════════════════════════════════════════════════════════════════════════

const userSockets = new Map(); // Map of userId -> socket id for real-time features

async function startServer() {
  try {
    // 1. Connect to MongoDB
    console.log("📟 Connecting to MongoDB...");
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected successfully");

    // 2. Create Express app
    const app = createApp();

    // 3. Create HTTP server
    const server = http.createServer(app);

    // 4. Initialize Socket.io for real-time chat
    const io = new SocketIOServer(server, {
      cors: {
        origin: env.CORS_ORIGIN,
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    // ═════════════════════════════════════════════════════════════════════════
    // SOCKET.IO MIDDLEWARE & EVENTS
    // ═════════════════════════════════════════════════════════════════════════

    // Authentication middleware for Socket.io
    io.use((socket, next) => {
      const userId = socket.handshake.auth.userId;
      if (!userId) {
        return next(new Error("Authentication failed: userId required"));
      }
      socket.userId = userId;
      next();
    });

    // Connection event
    io.on("connection", (socket) => {
      console.log(`👤 User connected: ${socket.userId}`);
      userSockets.set(socket.userId, socket.id);
      io.emit("user_online", { userId: socket.userId, timestamp: new Date() });

      // Join chat room with another user
      socket.on("join_chat", (withUserId) => {
        const roomName = [socket.userId, withUserId].sort().join(":");
        socket.join(roomName);
        socket.currentChatRoom = roomName;
        console.log(`💬 User ${socket.userId} joined chat room: ${roomName}`);
      });

      // Send real-time message
      socket.on("send_message", (data) => {
        const { toUserId, content } = data;
        if (!content) return;

        const roomName = [socket.userId, toUserId].sort().join(":");

        const messageData = {
          from: socket.userId,
          to: toUserId,
          content,
          createdAt: new Date(),
        };

        // Emit to all users in the room
        io.to(roomName).emit("receive_message", messageData);
      });

      // Typing indicator
      socket.on("typing", (withUserId) => {
        const roomName = [socket.userId, withUserId].sort().join(":");
        socket.to(roomName).emit("user_typing", { userId: socket.userId });
      });

      socket.on("stop_typing", (withUserId) => {
        const roomName = [socket.userId, withUserId].sort().join(":");
        socket.to(roomName).emit("user_stop_typing", { userId: socket.userId });
      });

      // Disconnect event
      socket.on("disconnect", () => {
        userSockets.delete(socket.userId);
        io.emit("user_offline", { userId: socket.userId, timestamp: new Date() });
        console.log(`👋 User disconnected: ${socket.userId}`);
      });

      // Error handling
      socket.on("error", (error) => {
        console.error(`⚠️  Socket error for user ${socket.userId}:`, error);
      });
    });

    // Attach io to app for use in controllers
    app.io = io;
    app.userSockets = userSockets;

    // ═════════════════════════════════════════════════════════════════════════
    // START SERVER
    // ═════════════════════════════════════════════════════════════════════════

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${env.PORT} is already in use. Stop the existing backend process or set PORT to another value.`
        );
        process.exit(1);
      }

      console.error("Server error:", error);
      process.exit(1);
    });

    server.listen(env.PORT, () => {
      console.log("\n" + "═".repeat(70));
      console.log("🚀 NestMate Backend Server Started");
      console.log("═".repeat(70));
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Server: http://localhost:${env.PORT}`);
      console.log(`Health: http://localhost:${env.PORT}/health`);
      console.log(`API:    http://localhost:${env.PORT}${env.API_PREFIX}`);
      console.log("═".repeat(70) + "\n");
    });

    // ═════════════════════════════════════════════════════════════════════════
    // GRACEFUL SHUTDOWN
    // ═════════════════════════════════════════════════════════════════════════

    const gracefulShutdown = async (signal) => {
      console.log(`\n⛔ ${signal} received. Shutting down gracefully...`);

      server.close(() => {
        console.log("✅ Server closed");
      });

      await mongoose.disconnect();
      console.log("✅ MongoDB disconnected");

      process.exit(0);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Unhandled rejection
    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

