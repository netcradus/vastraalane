const Wishlist = require("../models/Wishlist");

// ✅ Get all wishlist items
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add a new item to wishlist
exports.addWishlistItem = async (req, res) => {
  const item = new Wishlist(req.body);
  try {
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Remove item from wishlist
exports.removeWishlistItem = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
