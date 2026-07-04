const FoodRequest = require("../models/FoodRequest");
const FoodDonation = require("../models/FoodDonation");

// @desc    Receiver creates a request for a food donation
// @route   POST /api/requests
const createRequest = async (req, res) => {
  try {
    const { foodDonationId, message } = req.body;

    if (!foodDonationId) {
      return res.status(400).json({ message: "foodDonationId is required" });
    }

    const donation = await FoodDonation.findById(foodDonationId);
    if (!donation) {
      return res.status(404).json({ message: "Food donation not found" });
    }

    if (donation.status !== "Available") {
      return res
        .status(400)
        .json({ message: "This food donation is no longer available" });
    }

    const request = await FoodRequest.create({
      foodDonationId: donation._id,
      donorId: donation.donorId,
      receiverId: req.user._id,
      message: message || "",
      status: "Pending",
    });

    // Move the donation from Available to Requested
    donation.status = "Requested";
    await donation.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get requests made by the logged-in receiver
// @route   GET /api/requests/my-requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find({ receiverId: req.user._id })
      .populate("foodDonationId")
      .populate("donorId", "name organizationName phone email city")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get requests received by the logged-in donor
// @route   GET /api/requests/donor-requests
const getDonorRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find({ donorId: req.user._id })
      .populate("foodDonationId")
      .populate(
        "receiverId",
        "name organizationName phone email city receiverType"
      )
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Donor accepts a request
// @route   PUT /api/requests/:id/accept
const acceptRequest = async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this request" });
    }

    request.status = "Accepted";
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Donor rejects a request
// @route   PUT /api/requests/:id/reject
const rejectRequest = async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this request" });
    }

    request.status = "Rejected";
    await request.save();

    // Make the donation Available again since this request didn't work out
    const donation = await FoodDonation.findById(request.foodDonationId);
    if (donation && donation.status === "Requested") {
      donation.status = "Available";
      await donation.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Donor marks a request/donation as Completed
// @route   PUT /api/requests/:id/complete
const completeRequest = async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this request" });
    }

    request.status = "Completed";
    await request.save();

    const donation = await FoodDonation.findById(request.foodDonationId);
    if (donation) {
      donation.status = "Completed";
      await donation.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Receiver cancels their own request (only if still Pending)
// @route   PUT /api/requests/:id/cancel
const cancelRequest = async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this request" });
    }

    if (request.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be cancelled" });
    }

    request.status = "Cancelled";
    await request.save();

    // Make the donation Available again
    const donation = await FoodDonation.findById(request.foodDonationId);
    if (donation && donation.status === "Requested") {
      donation.status = "Available";
      await donation.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getDonorRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest,
};
