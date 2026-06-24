const mongoose = require("mongoose");

const INCIDENT_STATUSES = ["open", "investigating", "resolved"];

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: INCIDENT_STATUSES,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    actor: {
      type: String,
      enum: ["system", "user"],
      default: "system",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const incidentSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: INCIDENT_STATUSES,
      default: "open",
      index: true,
    },
    timeline: {
      type: [timelineEntrySchema],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      url: String,
      method: String,
      statusCode: Number,
      responseTimeMs: Number,
      errorMessage: String,
      downtimeSeconds: Number,
    },
  },
  { timestamps: true }
);

incidentSchema.index({ user: 1, createdAt: -1 });
incidentSchema.index({ monitor: 1, status: 1 });

module.exports = mongoose.model("Incident", incidentSchema);
module.exports.INCIDENT_STATUSES = INCIDENT_STATUSES;
