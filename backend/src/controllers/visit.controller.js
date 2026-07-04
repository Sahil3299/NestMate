const VisitRequest = require("../models/VisitRequest");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

/**
 * Create visit request (visitor initiates)
 */
exports.createVisitRequest = catchAsync(async (req, res, next) => {
  const { listingId, requestedDate, requestedTime, visitorNote } = req.body;

  // Validate listing exists
  const listing = await Listing.findById(listingId).populate("owner");
  if (!listing)
    throw new AppError("Listing not found", 404);

  // Visitor can't request to visit their own listing
  if (listing.owner._id.toString() === req.user.id)
    throw new AppError("Cannot request to visit your own listing", 400);

  // Check for existing pending request
  const existing = await VisitRequest.findOne({
    listing: listingId,
    fromUser: req.user.id,
    status: "pending",
  });

  if (existing)
    throw new AppError("You already have a pending visit request for this listing", 409);

  const visitRequest = await VisitRequest.create({
    listing: listingId,
    fromUser: req.user.id,
    toUser: listing.owner._id,
    requestedDate,
    requestedTime,
    visitorNote,
  });

  // Create notification for host
  await Notification.createNotification(
    "VISIT_REQUEST",
    listing.owner._id,
    `${req.user.name} requested to visit your listing "${listing.title}"`,
    {
      relatedModel: "VisitRequest",
      relatedId: visitRequest._id,
      metadata: { listingId, visitorName: req.user.name },
    }
  );

  sendResponse(res, 201, "Visit request created.", visitRequest);
});

/**
 * Get incoming requests for host (with pagination)
 */
exports.getIncomingRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { toUser: req.user.id };
  if (status) filter.status = status;

  const [requests, total] = await Promise.all([
    VisitRequest.find(filter)
      .populate("fromUser", "name email profile")
      .populate("listing", "title location budget images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    VisitRequest.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Incoming visit requests fetched.", requests, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

/**
 * Get sent requests for visitor (with pagination)
 */
exports.getSentRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { fromUser: req.user.id };
  if (status) filter.status = status;

  const [requests, total] = await Promise.all([
    VisitRequest.find(filter)
      .populate("toUser", "name email profile")
      .populate("listing", "title location budget images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    VisitRequest.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Sent visit requests fetched.", requests, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

/**
 * Get single visit request
 */
exports.getVisitRequest = catchAsync(async (req, res, next) => {
  const request = await VisitRequest.findById(req.params.id)
    .populate("fromUser", "name email profile")
    .populate("toUser", "name email profile")
    .populate("listing", "title location budget images");

  if (!request)
    throw new AppError("Visit request not found", 404);

  // Verify user is involved in the request
  if (
    request.fromUser._id.toString() !== req.user.id &&
    request.toUser._id.toString() !== req.user.id
  ) {
    throw new AppError("Unauthorized", 403);
  }

  sendResponse(res, 200, "Visit request fetched.", request);
});

/**
 * Confirm visit request (host accepts)
 */
exports.confirmVisitRequest = catchAsync(async (req, res, next) => {
  const request = await VisitRequest.findById(req.params.id);

  if (!request)
    throw new AppError("Visit request not found", 404);

  // Only host can confirm
  if (request.toUser.toString() !== req.user.id)
    throw new AppError("Only host can confirm visit request", 403);

  if (request.status !== "pending")
    throw new AppError(`Cannot confirm request with status: ${request.status}`, 400);

  await request.confirm();

  // Notify visitor
  const listing = await Listing.findById(request.listing);
  await Notification.createNotification(
    "VISIT_APPROVED",
    request.fromUser,
    `Your visit request for "${listing.title}" has been confirmed`,
    {
      relatedModel: "VisitRequest",
      relatedId: request._id,
    }
  );

  sendResponse(res, 200, "Visit request confirmed.", request);
});

/**
 * Decline visit request (host rejects)
 */
exports.declineVisitRequest = catchAsync(async (req, res, next) => {
  const { hostNote } = req.body;
  const request = await VisitRequest.findById(req.params.id);

  if (!request)
    throw new AppError("Visit request not found", 404);

  if (request.toUser.toString() !== req.user.id)
    throw new AppError("Only host can decline visit request", 403);

  if (request.status !== "pending")
    throw new AppError(`Cannot decline request with status: ${request.status}`, 400);

  await request.decline(hostNote);

  // Notify visitor
  const listing = await Listing.findById(request.listing);
  await Notification.createNotification(
    "VISIT_DECLINED",
    request.fromUser,
    `Your visit request for "${listing.title}" has been declined`,
    {
      relatedModel: "VisitRequest",
      relatedId: request._id,
    }
  );

  sendResponse(res, 200, "Visit request declined.", request);
});

/**
 * Complete visit request (after visit is done)
 */
exports.completeVisitRequest = catchAsync(async (req, res, next) => {
  const { visitorRating, visitorReview } = req.body;
  const request = await VisitRequest.findById(req.params.id);

  if (!request)
    throw new AppError("Visit request not found", 404);

  // Both host and visitor can complete
  if (
    request.fromUser.toString() !== req.user.id &&
    request.toUser.toString() !== req.user.id
  ) {
    throw new AppError("Unauthorized", 403);
  }

  if (request.status !== "confirmed")
    throw new AppError("Can only complete confirmed visit requests", 400);

  // Update visitor feedback if visitor is completing
  if (request.fromUser.toString() === req.user.id) {
    request.visitorRating = visitorRating;
    request.visitorReview = visitorReview;
  }

  await request.complete();

  sendResponse(res, 200, "Visit request marked as completed.", request);
});

/**
 * Cancel visit request
 */
exports.cancelVisitRequest = catchAsync(async (req, res, next) => {
  const request = await VisitRequest.findById(req.params.id);

  if (!request)
    throw new AppError("Visit request not found", 404);

  // Only visitor can cancel (or maybe host can too)
  if (request.fromUser.toString() !== req.user.id)
    throw new AppError("Only visitor can cancel the request", 403);

  if (request.status !== "pending" && request.status !== "confirmed")
    throw new AppError(
      `Cannot cancel request with status: ${request.status}`,
      400
    );

  await request.cancel();

  // Notify host
  await Notification.createNotification(
    "VISIT_DECLINED",
    request.toUser,
    "A visitor cancelled their visit request",
    {
      relatedModel: "VisitRequest",
      relatedId: request._id,
    }
  );

  sendResponse(res, 200, "Visit request cancelled.", request);
});

/**
 * Get visit statistics for host
 */
exports.getVisitStats = catchAsync(async (req, res, next) => {
  const stats = await VisitRequest.aggregate([
    { $match: { toUser: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    declined: 0,
    cancelled: 0,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
  });

  result.total = Object.values(result).reduce((a, b) => a + b, 0) - result.total || 0;

  sendResponse(res, 200, "Visit statistics fetched.", result);
});
