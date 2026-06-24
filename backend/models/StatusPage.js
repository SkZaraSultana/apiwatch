const mongoose = require("mongoose");
const crypto = require("crypto");

const statusPageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "APIWatch Status",
      trim: true,
      maxlength: 120,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

statusPageSchema.statics.generateSlug = function generateSlug() {
  return crypto.randomBytes(6).toString("hex");
};

module.exports = mongoose.model("StatusPage", statusPageSchema);
