const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

/**
 * Get user notifications with pagination
 * Query params: page, limit, read, type
 */
exports.getNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, read, type } = req.query;
  const skip = (page - 1) * limit;

  const filter = { recipient: req.user.id };
  if (read !== undefined) filter.read = read === "true";
  if (type) filter.type = type;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Notification.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Notifications fetched.", notifications, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    unreadCount: await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    }),
  });
});

/**
 * Get single notification
 */
exports.getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification)
    throw new AppError("Notification not found", 404);

  // Verify ownership
  if (notification.recipient.toString() !== req.user.id)
    throw new AppError("Unauthorized to view this notification", 403);

  sendResponse(res, 200, "Notification fetched.", notification);
});

/**
 * Mark notification as read
 */
exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification)
    throw new AppError("Notification not found", 404);

  if (notification.recipient.toString() !== req.user.id)
    throw new AppError("Unauthorized", 403);

  if (!notification.read) {
    await notification.markAsRead();
  }

  sendResponse(res, 200, "Notification marked as read.", notification);
});

/**
 * Mark all notifications as read
 */
exports.markAllAsRead = catchAsync(async (req, res, next) => {
  const result = await Notification.updateMany(
    { recipient: req.user.id, read: false },
    { read: true, readAt: new Date() }
  );

  sendResponse(res, 200, "All notifications marked as read.", {
    modifiedCount: result.modifiedCount,
  });
});

/**
 * Delete notification
 */
exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification)
    throw new AppError("Notification not found", 404);

  if (notification.recipient.toString() !== req.user.id)
    throw new AppError("Unauthorized", 403);

  await Notification.findByIdAndDelete(req.params.id);

  sendResponse(res, 204, "Notification deleted.");
});

/**
 * Clear all notifications for user
 */
exports.clearAllNotifications = catchAsync(async (req, res, next) => {
  const result = await Notification.deleteMany({ recipient: req.user.id });

  sendResponse(res, 200, "All notifications cleared.", {
    deletedCount: result.deletedCount,
  });
});

/**
 * Get unread count
 */
exports.getUnreadCount = catchAsync(async (req, res, next) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    read: false,
  });

  sendResponse(res, 200, "Unread count fetched.", { unreadCount });
});

/**
 * Create notification (internal use)
 * Called by other controllers when events happen
 */
exports.createNotification = catchAsync(async (req, res, next) => {
  const { type, recipient, message, relatedModel, relatedId, metadata } =
    req.body;

  const notification = await Notification.create({
    type,
    recipient,
    message,
    relatedModel,
    relatedId,
    metadata,
  });

  sendResponse(res, 201, "Notification created.", notification);
});
