const express = require("express");
const {
  createDonation,
  getAllDonations,
  getAvailableDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
} = require(
  "../controllers/donationController"
);
const {
  protectDonor,
} = require(
  "../middleware/authMiddleware"
);
const upload = require(
  "../middleware/uploadMiddleware"
);

const router = express.Router();

router.get(
  "/available",
  getAvailableDonations
);

router.get(
  "/my-donations",
  protectDonor,
  getMyDonations
);

router.post(
  "/",
  protectDonor,
  upload.single("foodImage"),
  createDonation
);

router.get(
  "/",
  getAllDonations
);

router.get(
  "/:id",
  getDonationById
);

router.put(
  "/:id",
  protectDonor,
  upload.single("foodImage"),
  updateDonation
);

router.delete(
  "/:id",
  protectDonor,
  deleteDonation
);

module.exports = router;