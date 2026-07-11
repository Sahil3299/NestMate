const Report = require('../models/Report');
const AppError = require('../utils/AppError');

exports.createReport = async (reporterId, data) => {
  if (!data.targetUser && !data.targetListing) {
    throw new AppError('Must specify a target user or listing', 400);
  }

  const report = await Report.create({
    reporter: reporterId,
    targetUser: data.targetUser || undefined,
    targetListing: data.targetListing || undefined,
    reason: data.reason,
    category: data.category || 'other',
  });

  return report;
};

exports.getReports = async (query = {}) => {
  const { status, page = 1, limit = 20 } = query;
  const filter = {};
  if (status) filter.status = status;

  const total = await Report.countDocuments(filter);
  const reports = await Report.find(filter)
    .populate('reporter', 'name email')
    .populate('targetUser', 'name email')
    .populate('targetListing', 'title')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    reports,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  };
};

exports.resolveReport = async (reportId, adminId, { status, notes }) => {
  const report = await Report.findById(reportId);
  if (!report) throw new AppError('Report not found', 404);

  report.status = status || 'resolved';
  report.reviewedBy = adminId;
  report.reviewedAt = new Date();
  if (notes) report.notes = notes;

  await report.save();
  return report;
};
