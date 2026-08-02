const bcrypt = require("bcryptjs");
const Donor = require("../models/Donor");
const generateToken = require("../utils/generateToken");

async function registerDonor(req, res) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const organizationName = req.body.organizationName;
    const address = req.body.address;
    const city = req.body.city;
    const fssaiNumber = String(req.body.fssaiNumber || "").trim();

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !organizationName ||
      !address ||
      !city ||
      !fssaiNumber
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (!/^\d{14}$/.test(fssaiNumber)) {
      return res.status(400).json({
        message: "FSSAI number must contain exactly 14 digits",
      });
    }

    const existingDonor = await Donor.findOne({
      email: email.toLowerCase(),
    });

    if (existingDonor) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const existingFssai = await Donor.findOne({
      fssaiNumber: fssaiNumber,
    });

    if (existingFssai) {
      return res.status(400).json({
        message: "This FSSAI number is already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const donor = await Donor.create({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      organizationName: organizationName,
      address: address,
      city: city,
      fssaiNumber: fssaiNumber,
      fssaiStatus: "Pending",
    });

    res.status(201).json({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      fssaiStatus: donor.fssaiStatus,
      message: "Registration submitted for FSSAI verification",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function loginDonor(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const donor = await Donor.findOne({
      email: email.toLowerCase(),
    });

    if (!donor) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      donor.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (donor.fssaiStatus === "Pending") {
      return res.status(403).json({
        message: "Your FSSAI verification is still pending",
      });
    }

    if (donor.fssaiStatus === "Rejected") {
      return res.status(403).json({
        message:
          donor.fssaiRejectionReason ||
          "Your FSSAI verification was rejected",
      });
    }

    if (donor.fssaiStatus !== "Verified") {
      return res.status(403).json({
        message: "Your donor account has not been verified",
      });
    }

    res.json({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      organizationName: donor.organizationName,
      fssaiNumber: donor.fssaiNumber,
      fssaiStatus: donor.fssaiStatus,
      role: donor.role,
      token: generateToken(donor._id, "donor"),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getDonorProfile(req, res) {
  res.json(req.user);
}

async function updateDonorProfile(req, res) {
  try {
    const donor = await Donor.findById(req.user._id);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    donor.name = req.body.name || donor.name;
    donor.phone = req.body.phone || donor.phone;
    donor.organizationName =
      req.body.organizationName || donor.organizationName;
    donor.address = req.body.address || donor.address;
    donor.city = req.body.city || donor.city;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      donor.password = await bcrypt.hash(
        req.body.password,
        salt
      );
    }

    const updatedDonor = await donor.save();

    res.json({
      _id: updatedDonor._id,
      name: updatedDonor.name,
      email: updatedDonor.email,
      organizationName: updatedDonor.organizationName,
      phone: updatedDonor.phone,
      address: updatedDonor.address,
      city: updatedDonor.city,
      fssaiNumber: updatedDonor.fssaiNumber,
      fssaiStatus: updatedDonor.fssaiStatus,
      role: updatedDonor.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function deleteDonorProfile(req, res) {
  try {
    await Donor.findByIdAndDelete(req.user._id);

    res.json({
      message: "Donor account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  registerDonor,
  loginDonor,
  getDonorProfile,
  updateDonorProfile,
  deleteDonorProfile,
};