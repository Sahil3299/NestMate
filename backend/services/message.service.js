const Message = require('../models/Message');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.sendMessage = async ({ sender, receiver, room, message }) => {
  if (sender.toString() === receiver.toString()) {
    throw new AppError('Cannot send a message to yourself', 400);
  }

  const msg = await Message.create({ sender, receiver, room, message });
  return msg;
};

exports.getConversation = async (userId, otherUserId, { page = 1, limit = 50 }) => {
  const filter = {
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  };

  const total = await Message.countDocuments(filter);
  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate('sender', 'name profileImage')
    .populate('receiver', 'name profileImage');

  return {
    messages: messages.reverse(),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

exports.getInbox = async (userId) => {
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', userId] },
            '$receiver',
            '$sender',
          ],
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { 'lastMessage.createdAt': -1 } },
  ]);

  await User.populate(messages, {
    path: '_id',
    select: 'name profileImage',
  });

  return messages.map((m) => ({
    user: m._id,
    lastMessage: m.lastMessage,
    unreadCount: m.unreadCount,
  }));
};

exports.getUnreadCount = async (userId) => {
  return Message.countDocuments({ receiver: userId, read: false });
};

exports.markAsRead = async (userId, senderId) => {
  await Message.updateMany(
    { sender: senderId, receiver: userId, read: false },
    { read: true }
  );
};
