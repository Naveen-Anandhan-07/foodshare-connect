const mongoose = require("mongoose");

const receiverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    organizationName: {
      type: String,
      required: [true, "Organization / NGO name is required"],
    },
    receiverType: {
      type: String,
      enum: ["NGO", "Shelter", "Volunteer", "Individual"],
      required: [true, "Receiver type is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    role: {
      type: String,
      default: "receiver",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Receiver", receiverSchema);
