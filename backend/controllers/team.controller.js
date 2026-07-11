const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const teamService = require('../services/team.service');

exports.createTeam = catchAsync(async (req, res, next) => {
  const team = await teamService.createTeam(req.user._id, req.body);
  sendResponse(res, 201, team, 'Team created successfully');
});

exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await teamService.getTeam(req.params.id);
  sendResponse(res, 200, team);
});

exports.joinTeam = catchAsync(async (req, res, next) => {
  const team = await teamService.joinTeam(req.params.id, req.user._id);
  sendResponse(res, 200, team, 'Joined team successfully');
});

exports.leaveTeam = catchAsync(async (req, res, next) => {
  const team = await teamService.leaveTeam(req.params.id, req.user._id);
  sendResponse(res, 200, team, 'Left team successfully');
});
