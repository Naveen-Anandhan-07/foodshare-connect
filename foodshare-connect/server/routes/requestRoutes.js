const express = require("express");
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getDonorRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest,
} = require("../controllers/requestController");
const { protectDonor, protectReceiver } = require("../middleware/authMiddleware");

router.post("/", protectReceiver, createRequest);
router.get("/my-requests", protectReceiver, getMyRequests);
router.get("/donor-requests", protectDonor, getDonorRequests);
router.put("/:id/accept", protectDonor, acceptRequest);
router.put("/:id/reject", protectDonor, rejectRequest);
router.put("/:id/complete", protectDonor, completeRequest);
router.put("/:id/cancel", protectReceiver, cancelRequest);

module.exports = router;
