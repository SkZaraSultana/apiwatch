const mongoose = require("mongoose");

const REPORT_PERIODS = ["daily", "weekly", "monthly"];
const REPORT_FORMATS = ["pdf", "csv"];

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: REPORT_PERIODS,
      required: true,
    },
    format: {
      type: String,
      enum: REPORT_FORMATS,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
module.exports.REPORT_PERIODS = REPORT_PERIODS;
module.exports.REPORT_FORMATS = REPORT_FORMATS;
