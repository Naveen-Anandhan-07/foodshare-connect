const crypto = require("crypto");
const FoodRequest = require(
  "../models/FoodRequest"
);
const FoodDonation = require(
  "../models/FoodDonation"
);

function hasExpired(donation) {
  const expiryTime =
    new Date(donation.expiryTime);

  const currentTime = new Date();

  return expiryTime <= currentTime;
}

function generatePickupOtp() {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

async function createRequest(req, res) {
  try {
    const foodDonationId =
      req.body.foodDonationId;

    const message =
      req.body.message || "";

    if (!foodDonationId) {
      return res.status(400).json({
        message:
          "foodDonationId is required",
      });
    }

    const donation =
      await FoodDonation.findById(
        foodDonationId
      );

    if (!donation) {
      return res.status(404).json({
        message:
          "Food donation not found",
      });
    }

    if (hasExpired(donation)) {
      donation.status = "Expired";

      await donation.save();

      return res.status(400).json({
        message:
          "This food donation has expired",
      });
    }

    if (
      donation.status !== "Available"
    ) {
      return res.status(400).json({
        message:
          "This food donation is no longer available",
      });
    }

    const existingRequest =
      await FoodRequest.findOne({
        foodDonationId:
          donation._id,
        receiverId:
          req.user._id,
        status: {
          $in: [
            "Pending",
            "Accepted",
          ],
        },
      });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "You already requested this food",
      });
    }

    const request =
      await FoodRequest.create({
        foodDonationId:
          donation._id,
        donorId:
          donation.donorId,
        receiverId:
          req.user._id,
        message: message,
        status: "Pending",
      });

    donation.status = "Requested";

    await donation.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getMyRequests(req, res) {
  try {
    const requests =
      await FoodRequest.find({
        receiverId: req.user._id,
      })
        .select("+pickupOtp")
        .populate(
          "foodDonationId"
        )
        .populate(
          "donorId",
          "name organizationName phone email city"
        )
        .sort({
          createdAt: -1,
        });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getDonorRequests(
  req,
  res
) {
  try {
    const requests =
      await FoodRequest.find({
        donorId: req.user._id,
      })
        .populate(
          "foodDonationId"
        )
        .populate(
          "receiverId",
          "name organizationName phone email city receiverType"
        )
        .sort({
          createdAt: -1,
        });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function acceptRequest(req, res) {
  try {
    const request =
      await FoodRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.donorId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized for this request",
      });
    }

    if (
      request.status !== "Pending"
    ) {
      return res.status(400).json({
        message:
          "Only pending requests can be accepted",
      });
    }

    const donation =
      await FoodDonation.findById(
        request.foodDonationId
      );

    if (!donation) {
      return res.status(404).json({
        message:
          "Food donation not found",
      });
    }

    if (hasExpired(donation)) {
      donation.status = "Expired";
      request.status = "Rejected";

      await donation.save();
      await request.save();

      return res.status(400).json({
        message:
          "This food donation has expired",
      });
    }

    request.status = "Accepted";
    request.pickupOtp =
      generatePickupOtp();
    request.otpCreatedAt =
      new Date();
    request.otpVerifiedAt = null;

    await request.save();

    res.json({
      message:
        "Request accepted and pickup OTP generated",
      status: request.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function rejectRequest(req, res) {
  try {
    const request =
      await FoodRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.donorId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized for this request",
      });
    }

    if (
      request.status !== "Pending"
    ) {
      return res.status(400).json({
        message:
          "Only pending requests can be rejected",
      });
    }

    request.status = "Rejected";

    await request.save();

    const donation =
      await FoodDonation.findById(
        request.foodDonationId
      );

    if (
      donation &&
      donation.status ===
        "Requested"
    ) {
      if (hasExpired(donation)) {
        donation.status = "Expired";
      } else {
        donation.status = "Available";
      }

      await donation.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function completeRequest(
  req,
  res
) {
  try {
    const enteredOtp = String(
      req.body.otp || ""
    ).trim();

    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        message:
          "Enter a valid 6-digit pickup OTP",
      });
    }

    const request =
      await FoodRequest.findById(
        req.params.id
      ).select("+pickupOtp");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.donorId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized for this request",
      });
    }

    if (
      request.status !== "Accepted"
    ) {
      return res.status(400).json({
        message:
          "Only accepted requests can be completed",
      });
    }

    if (
      !request.pickupOtp ||
      enteredOtp !== request.pickupOtp
    ) {
      return res.status(400).json({
        message:
          "Incorrect pickup OTP",
      });
    }

    const donation =
      await FoodDonation.findById(
        request.foodDonationId
      );

    if (!donation) {
      return res.status(404).json({
        message:
          "Food donation not found",
      });
    }

    if (hasExpired(donation)) {
      donation.status = "Expired";

      await donation.save();

      return res.status(400).json({
        message:
          "This food donation has expired",
      });
    }

    request.status = "Completed";
    request.pickupOtp = "";
    request.otpVerifiedAt =
      new Date();
    request.receiverLatitude = null;
    request.receiverLongitude = null;
    request.locationUpdatedAt = null;
    request.isLocationShared = false;

    donation.status = "Completed";

    await request.save();
    await donation.save();

    res.json({
      message:
        "Pickup confirmed successfully",
      status: request.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function cancelRequest(req, res) {
  try {
    const request =
      await FoodRequest.findById(
        req.params.id
      ).select("+pickupOtp");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.receiverId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized for this request",
      });
    }

    if (
      request.status !== "Pending"
    ) {
      return res.status(400).json({
        message:
          "Only pending requests can be cancelled",
      });
    }

    request.status = "Cancelled";
    request.pickupOtp = "";

    await request.save();

    const donation =
      await FoodDonation.findById(
        request.foodDonationId
      );

    if (
      donation &&
      donation.status ===
        "Requested"
    ) {
      if (hasExpired(donation)) {
        donation.status = "Expired";
      } else {
        donation.status = "Available";
      }

      await donation.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function updateReceiverLocation(
  req,
  res
) {
  try {
    const latitude = Number(
      req.body.latitude
    );
    const longitude = Number(
      req.body.longitude
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message:
          "Valid latitude and longitude are required",
      });
    }

    const request =
      await FoodRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.receiverId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized for this request",
      });
    }

    if (request.status !== "Accepted") {
      return res.status(400).json({
        message:
          "Location can only be shared for an accepted request",
      });
    }

    request.receiverLatitude = latitude;
    request.receiverLongitude = longitude;
    request.locationUpdatedAt =
      new Date();
    request.isLocationShared = true;

    await request.save();

    res.json({
      message: "Location updated",
      receiverLatitude: latitude,
      receiverLongitude: longitude,
      locationUpdatedAt:
        request.locationUpdatedAt,
      isLocationShared: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function stopLocationSharing(
  req,
  res
) {
  try {
    const request =
      await FoodRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.receiverId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized for this request",
      });
    }

    request.isLocationShared = false;
    request.receiverLatitude = null;
    request.receiverLongitude = null;
    request.locationUpdatedAt = null;

    await request.save();

    res.json({
      message:
        "Location sharing stopped",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  createRequest,
  getMyRequests,
  getDonorRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest,
  updateReceiverLocation,
  stopLocationSharing,
};
