const express = require("express");
const router = express.Router();
const {
  registerDonor,
  loginDonor,
  getDonorProfile,
  updateDonorProfile,
  deleteDonorProfile,
} = require("../controllers/donorController");
const { protectDonor } = require("../middleware/authMiddleware");

router.post("/register", registerDonor);
router.post("/login", loginDonor);
router.get("/profile", protectDonor, getDonorProfile);
router.put("/profile", protectDonor, updateDonorProfile);
router.delete("/profile", protectDonor, deleteDonorProfile);

module.exports = router;
