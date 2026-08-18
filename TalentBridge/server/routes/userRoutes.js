const express = require("express");
const router = express.Router();
const { getUserProfile, updateProfile, uploadProfilePicture } = require("../controllers/userController");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/:id", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.post("/upload-picture", protect, upload.single("image"), uploadProfilePicture);

module.exports = router;
