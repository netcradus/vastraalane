const Wishlist = require("../models/Wishlist");

exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addWishlistItem = async (req, res) => {
  try {
    const item = new Wishlist({
      ...req.body,
      userId: req.user.id,
    });

    await item.save();
    const items = await Wishlist.find({ userId: req.user.id });
    res.status(201).json(items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeWishlistItem = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    const items = await Wishlist.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
