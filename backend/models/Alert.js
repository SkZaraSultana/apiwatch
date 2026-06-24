const mongoose = require("mongoose");

const ALERT_TYPES = ["api_down", "recovery", "latency"];
const ALERT_SEVERITY = ["critical", "warning", "info"];

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },
    monitorName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ALERT_TYPES,
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ALERT_SEVERITY,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      url: String,
      method: String,
      statusCode: Number,
      responseTimeMs: Number,
      latencyThresholdMs: Number,
      errorMessage: String,
      downtimeSeconds: Number,
      checkedAt: Date,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

alertSchema.index({ user: 1, createdAt: -1 });
alertSchema.index({ monitor: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model("Alert", alertSchema);
module.exports.ALERT_TYPES = ALERT_TYPES;
