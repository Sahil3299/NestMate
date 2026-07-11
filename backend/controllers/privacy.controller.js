const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const privacyService = require('../services/privacy.service');

exports.revealContact = catchAsync(async (req, res, next) => {
  const result = await privacyService.revealContact(req.user._id, req.params.userId);
  sendResponse(res, 200, result, result.alreadyRevealed ? 'Contact already revealed' : 'Contact revealed');
});

exports.getRevealHistory = catchAsync(async (req, res, next) => {
  const history = await privacyService.getRevealHistory(req.user._id);
  sendResponse(res, 200, history);
});
