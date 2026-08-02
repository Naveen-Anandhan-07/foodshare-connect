const Donor = require("../models/Donor");
const generateToken = require("../utils/generateToken");

async function loginAdmin(req, res) {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD
    ) {
      return res.status(500).json({
        message: "Admin account is not configured",
      });
    }

    const correctEmail =
      email === process.env.ADMIN_EMAIL.toLowerCase();

    const correctPassword =
      password === process.env.ADMIN_PASSWORD;

    if (!correctEmail || !correctPassword) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    res.json({
      name: "Administrator",
      role: "admin",
      token: generateToken(email, "admin"),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getDonors(req, res) {
  try {
    const filter = {};

    if (
      req.query.status &&
      req.query.status !== "All"
    ) {
      filter.fssaiStatus = req.query.status;
    }

    const donors = await Donor.find(filter)
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.json(donors);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function updateFssaiStatus(req, res) {
  try {
    const status = req.body.status;
    const rejectionReason = String(
      req.body.rejectionReason || ""
    ).trim();

    if (
      status !== "Verified" &&
      status !== "Rejected"
    ) {
      return res.status(400).json({
        message: "Status must be Verified or Rejected",
      });
    }

    if (
      status === "Rejected" &&
      !rejectionReason
    ) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    donor.fssaiStatus = status;

    if (status === "Verified") {
      donor.fssaiVerifiedAt = new Date();
      donor.fssaiRejectionReason = "";
    } else {
      donor.fssaiVerifiedAt = null;
      donor.fssaiRejectionReason = rejectionReason;
    }

    await donor.save();

    res.json({
      message: "FSSAI status updated successfully",
      donor: {
        _id: donor._id,
        name: donor.name,
        organizationName: donor.organizationName,
        fssaiNumber: donor.fssaiNumber,
        fssaiStatus: donor.fssaiStatus,
        fssaiVerifiedAt: donor.fssaiVerifiedAt,
        fssaiRejectionReason:
          donor.fssaiRejectionReason,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  loginAdmin,
  getDonors,
  updateFssaiStatus,
};