const express = require("express");
const {
  loginAdmin,
  getDonors,
  updateFssaiStatus,
} = require("../controllers/adminController");
const protectAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/donors", protectAdmin, getDonors);
router.put(
  "/donors/:id/fssai-status",
  protectAdmin,
  updateFssaiStatus
);

module.exports = router;