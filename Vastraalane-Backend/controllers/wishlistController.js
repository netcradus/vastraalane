import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ success: true, items: user.wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  if (!user.wishlist.some((item) => item.toString() === productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  await user.populate("wishlist");
  res.status(201).json({ success: true, items: user.wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((item) => item.toString() !== req.params.productId);
  await user.save();
  await user.populate("wishlist");

  res.json({ success: true, items: user.wishlist });
});
