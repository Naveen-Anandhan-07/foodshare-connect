const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodRequest",
      required: true,
    },

    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodDonation",
      required: true,
    },

    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receiver",
      required: true,
    },

    reviewerRole: {
      type: String,
      enum: ["donor", "receiver"],
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    flagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  {
    requestId: 1,
    reviewerRole: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Review",
  reviewSchema
);