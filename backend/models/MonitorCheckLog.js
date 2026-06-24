const mongoose = require("mongoose");

const monitorCheckLogSchema = new mongoose.Schema(
  {
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    statusCode: {
      type: Number,
      default: null,
    },
    responseTimeMs: {
      type: Number,
      required: true,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

monitorCheckLogSchema.index({ monitor: 1, checkedAt: -1 });

module.exports = mongoose.model("MonitorCheckLog", monitorCheckLogSchema);
