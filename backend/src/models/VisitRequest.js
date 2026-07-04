const mongoose = require("mongoose");

const VisitRequestSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing is required"],
      index: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Visitor (fromUser) is required"],
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host (toUser) is required"],
      index: true,
    },
    requestedDate: {
      type: Date,
      required: [true, "Requested date is required"],
    },
    requestedTime: {
      type: String, // Format: "09:00-10:00" or "09:00 AM - 10:00 AM"
      required: [true, "Requested time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    hostNote: String,
    visitorNote: String,
    hostRating: Number, // Rating host gives to visitor
    hostReview: String,
    visitorRating: Number, // Rating visitor gives to listing/host
    visitorReview: String,
    completedAt: Date,
    respondedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

// Compound index for efficient queries
VisitRequestSchema.index({ listing: 1, status: 1 });
VisitRequestSchema.index({ toUser: 1, status: 1 });
VisitRequestSchema.index({ fromUser: 1, status: 1 });
VisitRequestSchema.index({ createdAt: -1 });

// Prevent duplicate pending requests for same listing
VisitRequestSchema.index(
  { listing: 1, fromUser: 1, status: 1 },
  {
    sparse: true,
    unique: true,
    partialFilterExpression: { status: "pending" },
  }
);

// Instance method to confirm visit
VisitRequestSchema.methods.confirm = async function () {
  this.status = "confirmed";
  this.respondedAt = new Date();
  return await this.save();
};

// Instance method to decline visit
VisitRequestSchema.methods.decline = async function (note = "") {
  this.status = "declined";
  this.respondedAt = new Date();
  this.hostNote = note;
  return await this.save();
};

// Instance method to mark as completed
VisitRequestSchema.methods.complete = async function () {
  this.status = "completed";
  this.completedAt = new Date();
  return await this.save();
};

// Instance method to cancel request
VisitRequestSchema.methods.cancel = async function () {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  return await this.save();
};

// Static method to get incoming requests for host
VisitRequestSchema.statics.getIncomingRequests = function (hostId, filters = {}) {
  const query = { toUser: hostId };

  if (filters.status) query.status = filters.status;
  if (filters.startDate || filters.endDate) {
    query.requestedDate = {};
    if (filters.startDate) query.requestedDate.$gte = filters.startDate;
    if (filters.endDate) query.requestedDate.$lte = filters.endDate;
  }

  return this.find(query)
    .populate("fromUser", "name email profile")
    .populate("listing", "title location budget")
    .sort({ createdAt: -1 });
};

// Static method to get sent requests for visitor
VisitRequestSchema.statics.getSentRequests = function (visitorId, filters = {}) {
  const query = { fromUser: visitorId };

  if (filters.status) query.status = filters.status;
  if (filters.startDate || filters.endDate) {
    query.requestedDate = {};
    if (filters.startDate) query.requestedDate.$gte = filters.startDate;
    if (filters.endDate) query.requestedDate.$lte = filters.endDate;
  }

  return this.find(query)
    .populate("toUser", "name email profile")
    .populate("listing", "title location budget")
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("VisitRequest", VisitRequestSchema);
