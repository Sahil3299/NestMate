const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const messageService = require('../services/message.service');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { receiverId, content } = req.body;
  const msg = await messageService.sendMessage({
    sender: req.user._id,
    receiver: receiverId,
    room: req.body.roomId,
    message: content,
  });
  sendResponse(res, 201, msg, 'Message sent');
});

exports.getConversation = catchAsync(async (req, res, next) => {
  const result = await messageService.getConversation(req.user._id, req.params.userId, req.query);
  sendResponse(res, 200, result.messages, undefined, { pagination: result.pagination });
});

exports.getInbox = catchAsync(async (req, res, next) => {
  const inbox = await messageService.getInbox(req.user._id);
  sendResponse(res, 200, inbox);
});

exports.getUnreadCount = catchAsync(async (req, res, next) => {
  const count = await messageService.getUnreadCount(req.user._id);
  sendResponse(res, 200, { count });
});
