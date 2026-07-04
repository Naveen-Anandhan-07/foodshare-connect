const jwt = require("jsonwebtoken");
const Donor = require("../models/Donor");
const Receiver = require("../models/Receiver");

// Reads the token from the Authorization header, verifies it,
// and makes sure the logged-in user is a Donor.
const protectDonor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "donor") {
      return res.status(403).json({ message: "Access denied. Donors only." });
    }

    const donor = await Donor.findById(decoded.id).select("-password");
    if (!donor) {
      return res.status(401).json({ message: "Donor not found" });
    }

    req.user = donor;
    req.user.role = "donor";
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Reads the token from the Authorization header, verifies it,
// and makes sure the logged-in user is a Receiver.
const protectReceiver = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "receiver") {
      return res.status(403).json({ message: "Access denied. Receivers only." });
    }

    const receiver = await Receiver.findById(decoded.id).select("-password");
    if (!receiver) {
      return res.status(401).json({ message: "Receiver not found" });
    }

    req.user = receiver;
    req.user.role = "receiver";
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protectDonor, protectReceiver };
