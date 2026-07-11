const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const messageService = require('../services/message.service');

exports.getConversations = catchAsync(async (req, res, next) => {
  const conversations = await messageService.getConversations(req.user._id);
  sendResponse(res, 200, conversations);
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const result = await messageService.getMessages(req.params.id, req.user._id, req.query);
  sendResponse(res, 200, result.messages, undefined, { pagination: result.pagination });
});

exports.sendMessageToUser = catchAsync(async (req, res, next) => {
  const { receiverId, content } = req.body;
  const msg = await messageService.sendMessageToUser({
    senderId: req.user._id,
    receiverId,
    content,
  });
  sendResponse(res, 201, msg, 'Message sent');
});

exports.startConversation = catchAsync(async (req, res, next) => {
  const { participantId, listingId } = req.body;
  const conversation = await messageService.getOrCreateConversation(req.user._id, participantId, listingId);
  sendResponse(res, 201, conversation, 'Conversation started');
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { conversationId, content, type } = req.body;
  const msg = await messageService.sendMessage({
    conversationId,
    senderId: req.user._id,
    content,
    type,
  });
  sendResponse(res, 201, msg, 'Message sent');
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  await messageService.markAsRead(req.params.id, req.user._id);
  sendResponse(res, 200, null, 'Messages marked as read');
});

exports.getConversationWithUser = catchAsync(async (req, res, next) => {
  const messages = await messageService.getConversationWithUser(req.user._id, req.params.userId);
  sendResponse(res, 200, messages);
});

exports.getUnreadCount = catchAsync(async (req, res, next) => {
  const count = await messageService.getUnreadCount(req.user._id);
  sendResponse(res, 200, { count });
});
