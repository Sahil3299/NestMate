const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getOrCreateConversation = async (userIdA, userIdB, listingId = null) => {
  if (userIdA.toString() === userIdB.toString()) {
    throw new AppError('Cannot start a conversation with yourself', 400);
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [userIdA, userIdB], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userIdA, userIdB],
      ...(listingId ? { relatedListing: listingId } : {}),
    });
  }

  return conversation;
};

exports.getConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate('participants', 'name profileImage city')
    .populate('lastMessage')
    .populate('relatedListing', 'title photos city rent')
    .sort({ lastMessageAt: -1 });

  return conversations;
};

exports.getMessages = async (conversationId, userId, { page = 1, limit = 50 }) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new AppError('Conversation not found', 404);

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === userId.toString()
  );
  if (!isParticipant) throw new AppError('Not a participant of this conversation', 403);

  const total = await Message.countDocuments({ conversation: conversationId });
  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate('sender', 'name profileImage');

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

exports.sendMessage = async ({ conversationId, senderId, content, type = 'text' }) => {
  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    content,
    type,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    lastMessageAt: new Date(),
  });

  const populated = await Message.findById(message._id)
    .populate('sender', 'name profileImage');

  return populated;
};

exports.markAsRead = async (conversationId, userId) => {
  await Message.updateMany(
    { conversation: conversationId, sender: { $ne: userId }, readAt: null },
    { readAt: new Date() }
  );
};

exports.getUnreadCount = async (userId) => {
  const conversations = await Conversation.find({ participants: userId });
  const convoIds = conversations.map((c) => c._id);

  const count = await Message.countDocuments({
    conversation: { $in: convoIds },
    sender: { $ne: userId },
    readAt: null,
  });

  return count;
};

exports.sendMessageToUser = async ({ senderId, receiverId, content }) => {
  const conversation = await this.getOrCreateConversation(senderId, receiverId);
  return this.sendMessage({
    conversationId: conversation._id,
    senderId,
    content,
  });
};

exports.getConversationWithUser = async (currentUserId, otherUserId) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, otherUserId], $size: 2 },
  });
  if (!conversation) return [];

  const messages = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: 1 })
    .populate('sender', 'name profileImage');

  return messages;
};
