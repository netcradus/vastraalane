const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} = require("../controllers/wishlistController");

// Routes
router.get("/", getWishlist);
router.post("/", addWishlistItem);
router.delete("/:id", removeWishlistItem);

module.exports = router;
