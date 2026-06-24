const mongoose = require("mongoose");

const SECURITY_EVENT_TYPES = [
  "server_error_spike",
  "high_latency",
  "repeated_failure",
  "malformed_url",
];

const SECURITY_SEVERITIES = ["low", "medium", "high", "critical"];

const securityEventSchema = new mongoose.Schema(
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
      default: null,
      index: true,
    },
    monitorName: {
      type: String,
      default: null,
      trim: true,
    },
    type: {
      type: String,
      enum: SECURITY_EVENT_TYPES,
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: SECURITY_SEVERITIES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    riskPoints: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    metadata: {
      url: String,
      statusCode: Number,
      responseTimeMs: Number,
      failureCount: Number,
      serverErrorCount: Number,
      windowSize: Number,
      issues: [String],
    },
    detectedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isDismissed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

securityEventSchema.index({ user: 1, type: 1, monitor: 1, detectedAt: -1 });

module.exports = mongoose.model("SecurityEvent", securityEventSchema);
module.exports.SECURITY_EVENT_TYPES = SECURITY_EVENT_TYPES;
