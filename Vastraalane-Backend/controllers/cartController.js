const CartItem = require("../models/CartItem");

exports.getCart = async (req, res) => {
  try {
    const cart = await CartItem.find({ userId: req.user.id });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const newItem = new CartItem({
      ...req.body,
      userId: req.user.id,
    });

    await newItem.save();
    const cart = await CartItem.find({ userId: req.user.id });
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await CartItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    const cart = await CartItem.find({ userId: req.user.id });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
