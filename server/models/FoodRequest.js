const mongoose = require("mongoose");

const foodRequestSchema =
  new mongoose.Schema(
    {
      foodDonationId: {
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

      message: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Accepted",
          "Rejected",
          "Completed",
          "Cancelled",
        ],
        default: "Pending",
      },

      pickupOtp: {
        type: String,
        default: "",
        select: false,
      },

      otpCreatedAt: {
        type: Date,
        default: null,
      },

      otpVerifiedAt: {
        type: Date,
        default: null,
      },

      receiverLatitude: {
        type: Number,
        default: null,
      },

      receiverLongitude: {
        type: Number,
        default: null,
      },

      locationUpdatedAt: {
        type: Date,
        default: null,
      },

      isLocationShared: {
        type: Boolean,
        default: false,
      },

      donorReviewSubmitted: {
        type: Boolean,
        default: false,
      },

      receiverReviewSubmitted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "FoodRequest",
  foodRequestSchema
);
