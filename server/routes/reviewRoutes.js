const express = require("express");
const {
  createDonorReview,
  createReceiverReview,
  getFlaggedReviews,
} = require(
  "../controllers/reviewController"
);
const {
  protectDonor,
  protectReceiver,
} = require(
  "../middleware/authMiddleware"
);
const protectAdmin = require(
  "../middleware/adminMiddleware"
);

const router = express.Router();

router.post(
  "/donor/:requestId",
  protectDonor,
  createDonorReview
);

router.post(
  "/receiver/:requestId",
  protectReceiver,
  createReceiverReview
);

router.get(
  "/flagged",
  protectAdmin,
  getFlaggedReviews
);

module.exports = router;