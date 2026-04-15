// backend/src/routes/message.routes.js
const router   = require("express").Router();
const ctrl     = require("../controllers/message.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { sendMessageSchema } = require("../validators/message.validator");

router.use(protect);

router.post(  "/",                          validate(sendMessageSchema), ctrl.sendMessage);
router.get(   "/inbox",                                                  ctrl.getInbox);
router.get(   "/unread",                                                 ctrl.getUnreadCount);
router.get(   "/conversation/:userId",                                   ctrl.getConversation);

module.exports = router;
