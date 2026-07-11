const { Router } = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.get('/', authenticate, messageController.getConversations);
router.get('/inbox', authenticate, messageController.getConversations);
router.get('/unread', authenticate, messageController.getUnreadCount);
router.get('/with/:userId', authenticate, messageController.getConversationWithUser);
router.get('/:id', authenticate, messageController.getMessages);
router.post(
  '/',
  authenticate,
  validate([
    body('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    body('content').trim().notEmpty().withMessage('Content is required'),
  ]),
  messageController.sendMessage
);
router.post(
  '/send',
  authenticate,
  validate([
    body('receiverId').isMongoId().withMessage('Invalid receiver ID'),
    body('content').trim().notEmpty().withMessage('Content is required'),
  ]),
  messageController.sendMessageToUser
);
router.post(
  '/start',
  authenticate,
  validate([
    body('participantId').isMongoId().withMessage('Invalid participant ID'),
  ]),
  messageController.startConversation
);
router.patch('/:id/read', authenticate, messageController.markAsRead);

module.exports = router;
