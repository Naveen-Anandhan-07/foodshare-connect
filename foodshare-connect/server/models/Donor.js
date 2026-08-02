const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
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
      required: [true, "Organization name is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    fssaiNumber: {
      type: String,
      required: [true, "FSSAI number is required"],
      unique: true,
      trim: true,
      match: [/^\d{14}$/, "FSSAI number must contain exactly 14 digits"],
    },
    fssaiStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    fssaiVerifiedAt: {
      type: Date,
      default: null,
    },
    fssaiRejectionReason: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "donor",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donor", donorSchema);