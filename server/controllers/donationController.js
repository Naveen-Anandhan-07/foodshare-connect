const fs = require("fs");
const path = require("path");
const FoodDonation = require(
  "../models/FoodDonation"
);

function deleteImage(imagePath) {
  if (!imagePath) {
    return;
  }

  const fileName = path.basename(imagePath);

  const completePath = path.join(
    __dirname,
    "..",
    "uploads",
    fileName
  );

  if (fs.existsSync(completePath)) {
    fs.unlinkSync(completePath);
  }
}

async function updateExpiredDonations() {
  await FoodDonation.updateMany(
    {
      status: {
        $in: [
          "Available",
          "Requested",
        ],
      },
      expiryTime: {
        $lte: new Date(),
      },
    },
    {
      status: "Expired",
    }
  );
}

function isPastDate(dateValue) {
  const date = new Date(dateValue);
  const currentDate = new Date();

  return date <= currentDate;
}

async function createDonation(req, res) {
  try {
    const foodName = req.body.foodName;
    const foodType = req.body.foodType;
    const quantity = req.body.quantity;
    const pickupLocation =
      req.body.pickupLocation;
    const city = req.body.city;
    const expiryTime =
      req.body.expiryTime;
    const description =
      req.body.description || "";

    if (
      !foodName ||
      !foodType ||
      !quantity ||
      !pickupLocation ||
      !city ||
      !expiryTime
    ) {
      if (req.file) {
        deleteImage(req.file.path);
      }

      return res.status(400).json({
        message:
          "Please fill all required fields",
      });
    }

    if (isPastDate(expiryTime)) {
      if (req.file) {
        deleteImage(req.file.path);
      }

      return res.status(400).json({
        message:
          "Expiry time must be in the future",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          "Please select a food image",
      });
    }

    const imagePath =
      "uploads/" + req.file.filename;

    const donation =
      await FoodDonation.create({
        donorId: req.user._id,
        foodName: foodName,
        foodType: foodType,
        quantity: quantity,
        pickupLocation:
          pickupLocation,
        city: city,
        expiryTime: expiryTime,
        description: description,
        image: imagePath,
        status: "Available",
      });

    res.status(201).json(donation);
  } catch (error) {
    if (req.file) {
      deleteImage(req.file.path);
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getAllDonations(req, res) {
  try {
    await updateExpiredDonations();

    const city = req.query.city;
    const foodType =
      req.query.foodType;

    const filter = {};

    if (city) {
      filter.city =
        new RegExp(city, "i");
    }

    if (foodType) {
      filter.foodType = foodType;
    }

    const donations =
      await FoodDonation.find(filter)
        .populate(
          "donorId",
          "name organizationName city phone email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getAvailableDonations(
  req,
  res
) {
  try {
    await updateExpiredDonations();

    const city = req.query.city;
    const foodType =
      req.query.foodType;

    const filter = {
      status: "Available",
      expiryTime: {
        $gt: new Date(),
      },
    };

    if (city) {
      filter.city =
        new RegExp(city, "i");
    }

    if (foodType) {
      filter.foodType = foodType;
    }

    const donations =
      await FoodDonation.find(filter)
        .populate(
          "donorId",
          "name organizationName city phone email"
        )
        .sort({
          expiryTime: 1,
        });

    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getMyDonations(req, res) {
  try {
    await updateExpiredDonations();

    const donations =
      await FoodDonation.find({
        donorId: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getDonationById(req, res) {
  try {
    await updateExpiredDonations();

    const donation =
      await FoodDonation.findById(
        req.params.id
      ).populate(
        "donorId",
        "name organizationName city phone email"
      );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function updateDonation(req, res) {
  try {
    const donation =
      await FoodDonation.findById(
        req.params.id
      );

    if (!donation) {
      if (req.file) {
        deleteImage(req.file.path);
      }

      return res.status(404).json({
        message: "Donation not found",
      });
    }

    const ownerId =
      donation.donorId.toString();

    const loggedInDonorId =
      req.user._id.toString();

    if (ownerId !== loggedInDonorId) {
      if (req.file) {
        deleteImage(req.file.path);
      }

      return res.status(403).json({
        message:
          "You can only edit your own donations",
      });
    }

    const newExpiryTime =
      req.body.expiryTime ||
      donation.expiryTime;

    const newStatus = donation.status;

    const expiryCanBePast =
      newStatus === "Expired" ||
      newStatus === "Completed";

    if (
      isPastDate(newExpiryTime) &&
      !expiryCanBePast
    ) {
      if (req.file) {
        deleteImage(req.file.path);
      }

      return res.status(400).json({
        message:
          "Expiry time must be in the future",
      });
    }

    const oldImage = donation.image;

    if (
      req.body.foodName !== undefined
    ) {
      donation.foodName =
        req.body.foodName;
    }

    if (
      req.body.foodType !== undefined
    ) {
      donation.foodType =
        req.body.foodType;
    }

    if (
      req.body.quantity !== undefined
    ) {
      donation.quantity =
        req.body.quantity;
    }

    if (
      req.body.pickupLocation !==
      undefined
    ) {
      donation.pickupLocation =
        req.body.pickupLocation;
    }

    if (
      req.body.city !== undefined
    ) {
      donation.city =
        req.body.city;
    }

    if (
      req.body.expiryTime !==
      undefined
    ) {
      donation.expiryTime =
        req.body.expiryTime;
    }

    if (
      req.body.description !==
      undefined
    ) {
      donation.description =
        req.body.description;
    }

    if (req.file) {
      donation.image =
        "uploads/" +
        req.file.filename;
    }

    if (
      isPastDate(
        donation.expiryTime
      ) &&
      donation.status !==
        "Completed"
    ) {
      donation.status = "Expired";
    }

    const updatedDonation =
      await donation.save();

    if (
      req.file &&
      oldImage &&
      oldImage !==
        updatedDonation.image
    ) {
      deleteImage(oldImage);
    }

    res.json(updatedDonation);
  } catch (error) {
    if (req.file) {
      deleteImage(req.file.path);
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function deleteDonation(req, res) {
  try {
    const donation =
      await FoodDonation.findById(
        req.params.id
      );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    const ownerId =
      donation.donorId.toString();

    const loggedInDonorId =
      req.user._id.toString();

    if (ownerId !== loggedInDonorId) {
      return res.status(403).json({
        message:
          "You can only delete your own donations",
      });
    }

    const image = donation.image;

    await donation.deleteOne();

    deleteImage(image);

    res.json({
      message:
        "Donation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  createDonation,
  getAllDonations,
  getAvailableDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};
