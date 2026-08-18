const express = require("express");
const router = express.Router();
const {
  createPost,
  getFeed,
  getUserPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} = require("../controllers/postController");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", protect, upload.single("image"), createPost);
router.get("/feed", protect, getFeed);
router.get("/user/:id", protect, getUserPosts);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

module.exports = router;
