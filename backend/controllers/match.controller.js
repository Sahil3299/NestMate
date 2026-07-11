const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const matchService = require('../services/match.service');

exports.getMatchWithUser = catchAsync(async (req, res, next) => {
  const match = await matchService.getOrComputeMatch(req.user._id, req.params.userId);
  sendResponse(res, 200, match);
});

exports.getSuggestions = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const suggestions = await matchService.getSuggestions(req.user._id, limit);
  sendResponse(res, 200, suggestions);
});
