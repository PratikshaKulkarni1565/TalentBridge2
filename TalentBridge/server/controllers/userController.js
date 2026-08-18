const User = require("../models/User");

// @route GET /api/users/:id
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// @route PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "headline",
      "about",
      "location",
      "skills",
      "education",
      "experience",
      "profilePicture",
      "coverPicture",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// @route POST /api/users/upload-picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const imagePath = `/uploads/${req.file.filename}`;

    const field = req.body.type === "cover" ? "coverPicture" : "profilePicture";
    const user = await User.findByIdAndUpdate(
      req.userId,
      { [field]: imagePath },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload picture", error: error.message });
  }
};
