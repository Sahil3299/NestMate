// backend/src/controllers/message.controller.js
"use strict";
const Message      = require("../models/Message");
const User         = require("../models/User");
const catchAsync   = require("../utils/catchAsync");
const AppError     = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// ── Send message ───────────────────────────────────────────────────────────
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { receiverId, content, listingId } = req.body;

  if (String(receiverId) === String(req.user._id)) {
    return next(new AppError("You cannot message yourself.", 400));
  }

  const receiver = await User.findById(receiverId);
  if (!receiver || !receiver.isActive) {
    return next(new AppError("Recipient not found.", 404));
  }

  const message = await Message.create({
    sender:   req.user._id,
    receiver: receiverId,
    listing:  listingId || null,
    content,
  });

  const populated = await message.populate([
    { path: "sender",   select: "name avatar isVerified" },
    { path: "receiver", select: "name avatar isVerified" },
    { path: "listing",  select: "title" },
  ]);

  sendResponse(res, 201, "Message sent.", populated);
});

// ── Get conversation between two users ────────────────────────────────────
exports.getConversation = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const page  = Number(req.query.page  || 1);
  const limit = Number(req.query.limit || 30);

  const filter = {
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId,       receiver: req.user._id },
    ],
  };

  const total    = await Message.countDocuments(filter);
  const messages = await Message.find(filter)
    .populate("sender",   "name avatar isVerified")
    .populate("receiver", "name avatar isVerified")
    .populate("listing",  "title")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // Mark unread as read
  await Message.updateMany(
    { sender: userId, receiver: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  sendResponse(res, 200, "Conversation fetched.", messages.reverse(), {
    total, page, limit,
  });
});

// ── Get all conversations (inbox) ─────────────────────────────────────────
exports.getInbox = catchAsync(async (req, res) => {
  // Get latest message per conversation partner
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $lt: ["$sender", "$receiver"] },
            { a: "$sender", b: "$receiver" },
            { a: "$receiver", b: "$sender" },
          ],
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$receiver", req.user._id] }, { $eq: ["$isRead", false] }] },
              1, 0,
            ],
          },
        },
      },
    },
    { $sort: { "lastMessage.createdAt": -1 } },
    { $limit: 50 },
  ]);

  // Populate partner info
  const User = require("../models/User");
  const populated = await Promise.all(
    conversations.map(async (conv) => {
      const msg       = conv.lastMessage;
      const partnerId = String(msg.sender) === String(req.user._id) ? msg.receiver : msg.sender;
      const partner   = await User.findById(partnerId).select("name avatar isVerified");
      return { ...conv, partner };
    })
  );

  sendResponse(res, 200, "Inbox fetched.", populated);
});

// ── Unread count ───────────────────────────────────────────────────────────
exports.getUnreadCount = catchAsync(async (req, res) => {
  const count = await Message.countDocuments({ receiver: req.user._id, isRead: false });
  sendResponse(res, 200, "Unread count.", { count });
});
