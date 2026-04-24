import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Order from "../models/Order.js";
import "../models/Product.js";

export const getMe = asyncHandler(async (req, res) => {
  const item = await User.findById(req.user._id).select("-passwordHash -refreshToken").populate("wishlist");
  res.json({ success: true, item });
});

export const updateMe = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name ?? req.user.name,
    email: req.body.email ?? req.user.email,
    avatar: req.body.avatar ?? req.user.avatar,
  };

  const item = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-passwordHash -refreshToken");

  res.json({ success: true, item });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ success: true, message: "Password updated" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const items = await User.find().select("-passwordHash -refreshToken").sort({ createdAt: -1 }).lean();
  const orderCounts = await Order.aggregate([{ $group: { _id: "$user", orderCount: { $sum: 1 } } }]);
  const orderMap = new Map(orderCounts.map((entry) => [String(entry._id), entry.orderCount]));

  res.json({
    success: true,
    items: items.map((item) => ({
      ...item,
      orderCount: orderMap.get(String(item._id)) || 0,
    })),
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  if (req.body.role === "admin") {
    res.status(400);
    throw new Error("Admin can only be created via seed script");
  }

  const targetUser = await User.findById(req.params.id).lean();
  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  if (targetUser.role === "admin") {
    res.status(400);
    throw new Error("The seeded admin user cannot be changed here");
  }

  const item = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  ).select("-passwordHash -refreshToken");

  res.json({ success: true, item });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const item = await User.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("User not found");
  }

  if (item.role === "admin") {
    res.status(400);
    throw new Error("The admin user cannot be deleted");
  }

  await item.deleteOne();
  res.json({ success: true, message: "User deleted" });
});
