const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const messageService = require('./message.service');

const onlineUsers = new Map();

function setupSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id name profileImage');
      if (!user) return next(new Error('User not found'));

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    socket.broadcast.emit('user_online', userId);

    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('message:send', async ({ conversationId, content, type = 'text' }) => {
      if (!conversationId || !content?.trim()) return;

      try {
        const msg = await messageService.sendMessage({
          conversationId,
          senderId: userId,
          content: content.trim(),
          type,
        });

        io.to(`conversation:${conversationId}`).emit('message:receive', msg);
      } catch (err) {
        socket.emit('error_message', 'Failed to send message');
      }
    });

    socket.on('typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing', {
        userId,
        conversationId,
      });
    });

    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('stop_typing', {
        userId,
        conversationId,
      });
    });

    socket.on('read:receipt', async ({ conversationId }) => {
      try {
        await messageService.markAsRead(conversationId, userId);
        io.to(`conversation:${conversationId}`).emit('messages:read', {
          conversationId,
          readBy: userId,
        });
      } catch (err) {
        // silently fail
      }
    });

    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('user_offline', userId);
        }
      }
    });
  });

  return io;
}

module.exports = { setupSocket, onlineUsers };
