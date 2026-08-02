const express = require("express");
const {
  createRequest,
  getMyRequests,
  getDonorRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest,
  updateReceiverLocation,
  stopLocationSharing,
} = require(
  "../controllers/requestController"
);
const {
  protectDonor,
  protectReceiver,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
  "/",
  protectReceiver,
  createRequest
);

router.get(
  "/my-requests",
  protectReceiver,
  getMyRequests
);

router.get(
  "/donor-requests",
  protectDonor,
  getDonorRequests
);

router.put(
  "/:id/accept",
  protectDonor,
  acceptRequest
);

router.put(
  "/:id/reject",
  protectDonor,
  rejectRequest
);

router.put(
  "/:id/complete",
  protectDonor,
  completeRequest
);

router.put(
  "/:id/cancel",
  protectReceiver,
  cancelRequest
);

router.put(
  "/:id/location",
  protectReceiver,
  updateReceiverLocation
);

router.put(
  "/:id/stop-location",
  protectReceiver,
  stopLocationSharing
);

module.exports = router;
