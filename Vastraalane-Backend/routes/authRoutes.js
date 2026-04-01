const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  getProfile
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authmiddleware");
const User = require("../models/User"); // Add User model for update route

// Login route
router.post("/login", login);

// Signup route
router.post("/signup", signup);

// Profile route with auth middleware
router.get("/profile", authenticateToken, getProfile);

// ✅ Update profile route
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,       // User ID from JWT token
      { $set: req.body }, // Update fields from request body
      { new: true }      // Return the updated document
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
