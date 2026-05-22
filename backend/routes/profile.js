const express = require("express");
const User = require("../models/User");
const { protectRoute } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update", protectRoute, async (req, res) => {
  try {
    const { name, bio, position, interests, social, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, position, interests, social, profilePicture },
      { returnDocument: 'after' }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;