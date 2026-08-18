const Post = require("../models/Post");
const Notification = require("../models/Notification");

// @route POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text && !req.file) {
      return res.status(400).json({ message: "Post must contain text or an image" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const post = await Post.create({ userId: req.userId, text, image });
    const populatedPost = await post.populate("userId", "name profilePicture headline");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

// @route GET /api/posts/feed
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name profilePicture headline")
      .populate("comments.userId", "name profilePicture");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feed", error: error.message });
  }
};

// @route GET /api/posts/user/:id
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("userId", "name profilePicture headline");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user posts", error: error.message });
  }
};

// @route PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    post.text = req.body.text ?? post.text;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

// @route DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// @route PUT /api/posts/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.some((id) => id.toString() === req.userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
    } else {
      post.likes.push(req.userId);
      if (post.userId.toString() !== req.userId) {
        await Notification.create({
          userId: post.userId,
          fromUser: req.userId,
          type: "like",
          message: "liked your post",
          link: `/post/${post._id}`,
        });
      }
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle like", error: error.message });
  }
};

// @route POST /api/posts/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId: req.userId, text });
    await post.save();

    if (post.userId.toString() !== req.userId) {
      await Notification.create({
        userId: post.userId,
        fromUser: req.userId,
        type: "comment",
        message: "commented on your post",
        link: `/post/${post._id}`,
      });
    }

    const populatedPost = await post.populate("comments.userId", "name profilePicture");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};
