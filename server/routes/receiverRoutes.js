const express = require("express");
const router = express.Router();
const {
  registerReceiver,
  loginReceiver,
  getReceiverProfile,
  updateReceiverProfile,
  deleteReceiverProfile,
} = require("../controllers/receiverController");
const { protectReceiver } = require("../middleware/authMiddleware");

router.post("/register", registerReceiver);
router.post("/login", loginReceiver);
router.get("/profile", protectReceiver, getReceiverProfile);
router.put("/profile", protectReceiver, updateReceiverProfile);
router.delete("/profile", protectReceiver, deleteReceiverProfile);

module.exports = router;
