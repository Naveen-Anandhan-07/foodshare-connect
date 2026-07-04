const bcrypt = require("bcryptjs");
const Receiver = require("../models/Receiver");
const generateToken = require("../utils/generateToken");

// @desc    Register a new receiver
// @route   POST /api/receivers/register
const registerReceiver = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      organizationName,
      receiverType,
      address,
      city,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !organizationName ||
      !receiverType ||
      !address ||
      !city
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingReceiver = await Receiver.findOne({ email: email.toLowerCase() });
    if (existingReceiver) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const receiver = await Receiver.create({
      name,
      email,
      password: hashedPassword,
      phone,
      organizationName,
      receiverType,
      address,
      city,
    });

    res.status(201).json({
      _id: receiver._id,
      name: receiver.name,
      email: receiver.email,
      organizationName: receiver.organizationName,
      receiverType: receiver.receiverType,
      role: receiver.role,
      token: generateToken(receiver._id, "receiver"),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login receiver
// @route   POST /api/receivers/login
const loginReceiver = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const receiver = await Receiver.findOne({ email: email.toLowerCase() });
    if (!receiver) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, receiver.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: receiver._id,
      name: receiver.name,
      email: receiver.email,
      organizationName: receiver.organizationName,
      receiverType: receiver.receiverType,
      role: receiver.role,
      token: generateToken(receiver._id, "receiver"),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get receiver profile
// @route   GET /api/receivers/profile
const getReceiverProfile = async (req, res) => {
  res.json(req.user);
};

// @desc    Update receiver profile
// @route   PUT /api/receivers/profile
const updateReceiverProfile = async (req, res) => {
  try {
    const receiver = await Receiver.findById(req.user._id);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const { name, phone, organizationName, receiverType, address, city, password } =
      req.body;

    receiver.name = name || receiver.name;
    receiver.phone = phone || receiver.phone;
    receiver.organizationName = organizationName || receiver.organizationName;
    receiver.receiverType = receiverType || receiver.receiverType;
    receiver.address = address || receiver.address;
    receiver.city = city || receiver.city;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      receiver.password = await bcrypt.hash(password, salt);
    }

    const updatedReceiver = await receiver.save();

    res.json({
      _id: updatedReceiver._id,
      name: updatedReceiver.name,
      email: updatedReceiver.email,
      organizationName: updatedReceiver.organizationName,
      receiverType: updatedReceiver.receiverType,
      phone: updatedReceiver.phone,
      address: updatedReceiver.address,
      city: updatedReceiver.city,
      role: updatedReceiver.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete receiver profile
// @route   DELETE /api/receivers/profile
const deleteReceiverProfile = async (req, res) => {
  try {
    await Receiver.findByIdAndDelete(req.user._id);
    res.json({ message: "Receiver account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerReceiver,
  loginReceiver,
  getReceiverProfile,
  updateReceiverProfile,
  deleteReceiverProfile,
};
