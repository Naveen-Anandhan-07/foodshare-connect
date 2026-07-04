const mongoose = require("mongoose");

const foodDonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    foodName: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    foodType: {
      type: String,
      enum: [
        "Cooked Food",
        "Raw Ingredients",
        "Packaged Food",
        "Fruits/Vegetables",
        "Bakery Items",
        "Others",
      ],
      required: [true, "Food type is required"],
    },
    quantity: {
      type: String,
      required: [true, "Quantity is required"],
    },
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    expiryTime: {
      type: Date,
      required: [true, "Expiry time is required"],
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Available", "Requested", "Completed", "Expired"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodDonation", foodDonationSchema);
