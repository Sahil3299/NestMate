const router = require("express").Router();
const ctrl = require("../controllers/notification.controller");
const { authenticate } = require("../middleware/auth");

// All notification routes require authentication
router.use(authenticate);

// Get notifications
router.get("/", ctrl.getNotifications);

// Get unread count
router.get("/unread/count", ctrl.getUnreadCount);

// Get single notification
router.get("/:id", ctrl.getNotification);

// Mark as read
router.patch("/:id/read", ctrl.markAsRead);

// Mark all as read
router.post("/read-all", ctrl.markAllAsRead);

// Delete notification
router.delete("/:id", ctrl.deleteNotification);

// Clear all notifications
router.delete("/", ctrl.clearAllNotifications);

module.exports = router;
