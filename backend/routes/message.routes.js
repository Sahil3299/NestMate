const { Router } = require('express');
const messageController = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendMessageValidator } = require('../validators/message.validator');

const router = Router();

router.post('/', authenticate, validate(sendMessageValidator), messageController.sendMessage);
router.get('/inbox', authenticate, messageController.getInbox);
router.get('/conversation/:userId', authenticate, messageController.getConversation);
router.get('/unread', authenticate, messageController.getUnreadCount);

module.exports = router;
