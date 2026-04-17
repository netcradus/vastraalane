const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authmiddleware");
const {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} = require("../controllers/wishlistController");

// Routes
router.get("/", authenticateToken, getWishlist);
router.post("/", authenticateToken, addWishlistItem);
router.delete("/:id", authenticateToken, removeWishlistItem);

module.exports = router;
