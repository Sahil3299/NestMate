const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "LISTING_CREATED",
        "NEW_MESSAGE",
        "VISIT_REQUEST",
        "VISIT_APPROVED",
        "VISIT_DECLINED",
        "REVIEW_LEFT",
        "MATCH_FOUND",
        "PROFILE_VIEWED",
        "LISTING_SAVED",
        "LISTING_APPROVED",
        "LISTING_REJECTED",
      ],
      required: [true, "Notification type is required"],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedModel: {
      type: String,
      enum: ["Listing", "Message", "User", "Review", "VisitRequest", "Match"],
    },
    relatedId: mongoose.Schema.Types.ObjectId,
    metadata: mongoose.Schema.Types.Mixed, // For storing extra data like listing price, user name, etc.
    actionUrl: String, // URL to navigate to when notification is clicked
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    readAt: Date,
  },
  { timestamps: true }
);

// Index for common queries
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });

// Virtual for checking if unread
NotificationSchema.virtual("isUnread").get(function () {
  return !this.read;
});

// Static method to create notification
NotificationSchema.statics.createNotification = async function (
  type,
  recipient,
  message,
  options = {}
) {
  return await this.create({
    type,
    recipient,
    message,
    relatedModel: options.relatedModel,
    relatedId: options.relatedId,
    metadata: options.metadata,
    actionUrl: options.actionUrl,
  });
};

// Instance method to mark as read
NotificationSchema.methods.markAsRead = async function () {
  this.read = true;
  this.readAt = new Date();
  return await this.save();
};

module.exports = mongoose.model("Notification", NotificationSchema);
