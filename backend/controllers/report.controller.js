const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const reportService = require('../services/report.service');

exports.createReport = catchAsync(async (req, res, next) => {
  const report = await reportService.createReport(req.user._id, req.body);
  sendResponse(res, 201, report, 'Report submitted successfully');
});

exports.getReports = catchAsync(async (req, res, next) => {
  const result = await reportService.getReports(req.query);
  sendResponse(res, 200, result.reports, undefined, { pagination: result.pagination });
});

exports.resolveReport = catchAsync(async (req, res, next) => {
  const report = await reportService.resolveReport(req.params.id, req.user._id, req.body);
  sendResponse(res, 200, report, 'Report resolved');
});
