const mongoose = require("mongoose");

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const monitorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      enum: HTTP_METHODS,
      default: "GET",
    },
    expectedStatus: {
      type: Number,
      required: true,
      min: 100,
      max: 599,
      default: 200,
    },
    interval: {
      type: Number,
      required: true,
      min: 30,
      default: 300,
    },
    timeout: {
      type: Number,
      required: true,
      min: 1000,
      max: 120000,
      default: 10000,
    },
    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
    lastCheckedAt: {
      type: Date,
      default: null,
    },
    lastStatusCode: {
      type: Number,
      default: null,
    },
    lastResponseTimeMs: {
      type: Number,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: null,
    },
    uptimePercent: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    totalDowntimeSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalChecks: {
      type: Number,
      default: 0,
      min: 0,
    },
    successfulChecks: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentState: {
      type: String,
      enum: ["up", "down", "unknown"],
      default: "unknown",
    },
    downtimeStartedAt: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: null,
    },
    latencyThresholdMs: {
      type: Number,
      default: 3000,
      min: 100,
      max: 120000,
    },
    lastLatencyAlertAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

monitorSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Monitor", monitorSchema);
module.exports.HTTP_METHODS = HTTP_METHODS;
