import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal = 0 } = req.body;
  const coupon = await Coupon.findOne({ code: String(code || "").toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  if (coupon.expiryDate < new Date()) {
    res.status(400);
    throw new Error("Coupon expired");
  }

  if (subtotal < coupon.minOrderAmount) {
    res.status(400);
    throw new Error("Order value does not meet coupon minimum");
  }

  const discountAmount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  res.json({ success: true, item: coupon, discountAmount });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const items = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, items });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const item = await Coupon.create({ ...req.body, code: String(req.body.code).toUpperCase() });
  res.status(201).json({ success: true, item });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const item = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  res.json({ success: true, item });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const item = await Coupon.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await item.deleteOne();
  res.json({ success: true, message: "Coupon deleted" });
});
