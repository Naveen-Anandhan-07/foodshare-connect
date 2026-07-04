const bcrypt = require("bcryptjs");
const Donor = require("../models/Donor");
const generateToken = require("../utils/generateToken");

// @desc    Register a new donor
// @route   POST /api/donors/register
const registerDonor = async (req, res) => {
  try {
    const { name, email, password, phone, organizationName, address, city } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !organizationName ||
      !address ||
      !city
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingDonor = await Donor.findOne({ email: email.toLowerCase() });
    if (existingDonor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const donor = await Donor.create({
      name,
      email,
      password: hashedPassword,
      phone,
      organizationName,
      address,
      city,
    });

    res.status(201).json({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      organizationName: donor.organizationName,
      role: donor.role,
      token: generateToken(donor._id, "donor"),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login donor
// @route   POST /api/donors/login
const loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const donor = await Donor.findOne({ email: email.toLowerCase() });
    if (!donor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      organizationName: donor.organizationName,
      role: donor.role,
      token: generateToken(donor._id, "donor"),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get donor profile
// @route   GET /api/donors/profile
const getDonorProfile = async (req, res) => {
  res.json(req.user);
};

// @desc    Update donor profile
// @route   PUT /api/donors/profile
const updateDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findById(req.user._id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const { name, phone, organizationName, address, city, password } = req.body;

    donor.name = name || donor.name;
    donor.phone = phone || donor.phone;
    donor.organizationName = organizationName || donor.organizationName;
    donor.address = address || donor.address;
    donor.city = city || donor.city;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      donor.password = await bcrypt.hash(password, salt);
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
      role: updatedDonor.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete donor profile
// @route   DELETE /api/donors/profile
const deleteDonorProfile = async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.user._id);
    res.json({ message: "Donor account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerDonor,
  loginDonor,
  getDonorProfile,
  updateDonorProfile,
  deleteDonorProfile,
};
