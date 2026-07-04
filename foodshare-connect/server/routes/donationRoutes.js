const express = require("express");
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getAvailableDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
} = require("../controllers/donationController");
const { protectDonor } = require("../middleware/authMiddleware");

// Public/shared reads
router.get("/available", getAvailableDonations);

// Donor-only routes (must come before /:id to avoid route collisions)
router.get("/my-donations", protectDonor, getMyDonations);
router.post("/", protectDonor, createDonation);

router.get("/", getAllDonations);
router.get("/:id", getDonationById);
router.put("/:id", protectDonor, updateDonation);
router.delete("/:id", protectDonor, deleteDonation);

module.exports = router;
