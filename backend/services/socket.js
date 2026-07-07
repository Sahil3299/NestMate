const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const Message = require('../models/Message');

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

    socket.on('join_chat', (otherUserId) => {
      const room = getChatRoom(userId, otherUserId);
      socket.join(room);
    });

    socket.on('send_message', async ({ toUid, text }) => {
      if (!toUid || !text?.trim()) return;

      try {
        const msg = await Message.create({
          sender: userId,
          receiver: toUid,
          message: text.trim(),
        });

        const populated = await Message.findById(msg._id)
          .populate('sender', 'name profileImage')
          .populate('receiver', 'name profileImage');

        const room = getChatRoom(userId, toUid);
        io.to(room).emit('receive_message', {
          _id: populated._id,
          content: populated.message,
          sender: { _id: populated.sender._id, name: populated.sender.name, profileImage: populated.sender.profileImage },
          receiver: { _id: populated.receiver._id, name: populated.receiver.name, profileImage: populated.receiver.profileImage },
          createdAt: populated.createdAt,
          read: populated.read,
        });
      } catch (err) {
        socket.emit('error_message', 'Failed to send message');
      }
    });

    socket.on('typing', (otherUserId) => {
      const room = getChatRoom(userId, otherUserId);
      socket.to(room).emit('user_typing', userId);
    });

    socket.on('stop_typing', (otherUserId) => {
      const room = getChatRoom(userId, otherUserId);
      socket.to(room).emit('user_stop_typing', userId);
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

function getChatRoom(uid1, uid2) {
  return `chat:${[uid1, uid2].sort().join(':')}`;
}

module.exports = { setupSocket, onlineUsers, getChatRoom };
