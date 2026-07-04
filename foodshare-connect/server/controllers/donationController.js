const FoodDonation = require("../models/FoodDonation");

// Helper: if expiry time has passed and donation is still Available/Requested,
// mark it Expired. Keeps logic simple and beginner-friendly.
const applyExpiryStatus = (donation) => {
  const doc = donation.toObject ? donation.toObject() : donation;
  const isPastExpiry = new Date(doc.expiryTime) < new Date();
  if (isPastExpiry && (doc.status === "Available" || doc.status === "Requested")) {
    doc.status = "Expired";
  }
  return doc;
};

// @desc    Create a new food donation (Donor only)
// @route   POST /api/donations
const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      foodType,
      quantity,
      pickupLocation,
      city,
      expiryTime,
      description,
    } = req.body;

    if (!foodName || !foodType || !quantity || !pickupLocation || !city || !expiryTime) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const donation = await FoodDonation.create({
      donorId: req.user._id,
      foodName,
      foodType,
      quantity,
      pickupLocation,
      city,
      expiryTime,
      description,
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all donations (with optional city/foodType filters)
// @route   GET /api/donations
const getAllDonations = async (req, res) => {
  try {
    const { city, foodType } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, "i");
    if (foodType) filter.foodType = foodType;

    const donations = await FoodDonation.find(filter)
      .populate("donorId", "name organizationName city phone email")
      .sort({ createdAt: -1 });

    res.json(donations.map(applyExpiryStatus));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get only Available donations (for receivers), with search/filter
// @route   GET /api/donations/available
const getAvailableDonations = async (req, res) => {
  try {
    const { city, foodType } = req.query;
    const filter = { status: "Available", expiryTime: { $gte: new Date() } };
    if (city) filter.city = new RegExp(city, "i");
    if (foodType) filter.foodType = foodType;

    const donations = await FoodDonation.find(filter)
      .populate("donorId", "name organizationName city phone email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get donations belonging to the logged-in donor
// @route   GET /api/donations/my-donations
const getMyDonations = async (req, res) => {
  try {
    const donations = await FoodDonation.find({ donorId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(donations.map(applyExpiryStatus));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single donation by id
// @route   GET /api/donations/:id
const getDonationById = async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id).populate(
      "donorId",
      "name organizationName city phone email"
    );
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json(applyExpiryStatus(donation));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a donation (Donor who owns it only)
// @route   PUT /api/donations/:id
const updateDonation = async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own donations" });
    }

    const fields = [
      "foodName",
      "foodType",
      "quantity",
      "pickupLocation",
      "city",
      "expiryTime",
      "description",
      "status",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        donation[field] = req.body[field];
      }
    });

    const updated = await donation.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a donation (Donor who owns it only)
// @route   DELETE /api/donations/:id
const deleteDonation = async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own donations" });
    }

    await donation.deleteOne();
    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getAvailableDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};
