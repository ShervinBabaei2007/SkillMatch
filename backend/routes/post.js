const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const { protectRoute } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protectRoute, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", protectRoute, async (req, res) => {
  try {
    const { image, caption } = req.body;

    const post = new Post({
      user: req.user._id,
      image,
      caption,
    });

    await post.save();

    // Add post to user's posts array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id }
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;