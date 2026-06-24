const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: Object },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
