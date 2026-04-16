const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  sendMessage,
  getInbox,
  getConversation,
  getUnreadCount,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");

/**
 * All routes require authentication
 */
router.use(authenticate);

// Message operations
router.post("/", sendMessage);
router.get("/inbox", getInbox);
router.get("/unread", getUnreadCount);
router.get("/conversation/:userId", getConversation);
router.patch("/:messageId/read", markAsRead);
router.delete("/:messageId", deleteMessage);

module.exports = router;
