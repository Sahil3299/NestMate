const Message = require("../models/Message");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, ValidationError } = require("../utils/errors");

/**
 * Send message
 * POST /api/v1/messages
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  // Validation
  if (!receiverId || !content) {
    throw new ValidationError("receiverId and content are required");
  }

  if (content.trim().length === 0) {
    throw new ValidationError("Message cannot be empty");
  }

  // Check receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new NotFoundError("Receiver not found");
  }

  // Create message
  const message = await Message.create({
    sender: req.user.id,
    receiver: receiverId,
    content: content.trim(),
    conversationId: [req.user.id, receiverId].sort().join(":"),
  });

  await message.populate("sender", "name email avatar");

  // Emit real-time event if socket.io is available
  if (req.app.io) {
    const roomName = [req.user.id, receiverId].sort().join(":");
    req.app.io.to(roomName).emit("receive_message", {
      _id: message._id,
      from: message.sender._id,
      to: message.receiver,
      content: message.content,
      createdAt: message.createdAt,
    });
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
});

/**
 * Get inbox (conversations list)
 * GET /api/v1/messages/inbox
 */
const getInbox = asyncHandler(async (req, res) => {
  // Get all unique conversations for the user
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: { $oid: req.user.id } }, { receiver: { $oid: req.user.id } }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $lt: [{ $toString: "$sender" }, { $toString: "$receiver" }] },
            {
              sender: "$sender",
              receiver: "$receiver",
            },
            {
              sender: "$receiver",
              receiver: "$sender",
            },
          ],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    {
      $sort: { "lastMessage.createdAt": -1 },
    },
    {
      $limit: 50,
    },
  ]);

  // Populate sender and receiver details
  const conversations = await Promise.all(
    messages.map(async (msg) => {
      const otherUserId =
        msg.lastMessage.sender.toString() === req.user.id
          ? msg.lastMessage.receiver
          : msg.lastMessage.sender;

      const otherUser = await User.findById(otherUserId).select("name email avatar");

      return {
        conversationWith: otherUser,
        lastMessage: msg.lastMessage.content,
        lastMessageTime: msg.lastMessage.createdAt,
        isRead: msg.lastMessage.isRead,
      };
    })
  );

  res.json({
    success: true,
    data: conversations,
  });
});

/**
 * Get conversation with specific user
 * GET /api/v1/messages/conversation/:userId
 */
const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const skip = (page - 1) * limit;

  // Get messages between two users
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: userId },
      { sender: userId, receiver: req.user.id },
    ],
  })
    .populate("sender", "name email avatar")
    .populate("receiver", "name email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Reverse to show oldest first
  messages.reverse();

  // Mark messages as read where current user is receiver
  await Message.updateMany(
    {
      receiver: req.user.id,
      sender: userId,
      isRead: false,
    },
    { isRead: true }
  );

  res.json({
    success: true,
    data: messages,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
    },
  });
});

/**
 * Get unread message count
 * GET /api/v1/messages/unread
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Message.countDocuments({
    receiver: req.user.id,
    isRead: false,
  });

  res.json({
    success: true,
    data: { unreadCount },
  });
});

/**
 * Mark message as read
 * PATCH /api/v1/messages/:messageId/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findByIdAndUpdate(
    messageId,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    throw new NotFoundError("Message not found");
  }

  res.json({
    success: true,
    message: "Message marked as read",
    data: message,
  });
});

/**
 * Delete message
 * DELETE /api/v1/messages/:messageId
 */
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    throw new NotFoundError("Message not found");
  }

  // Only sender can delete
  if (message.sender.toString() !== req.user.id) {
    throw new AuthorizationError("You can only delete your own messages");
  }

  await Message.findByIdAndDelete(messageId);

  res.json({
    success: true,
    message: "Message deleted successfully",
  });
});

module.exports = {
  sendMessage,
  getInbox,
  getConversation,
  getUnreadCount,
  markAsRead,
  deleteMessage,
};
