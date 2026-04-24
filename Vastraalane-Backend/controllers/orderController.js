import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { createRazorpayOrder, getRazorpayPublicConfig, verifyRazorpaySignature } from "../utils/razorpay.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, shippingMethod, subtotal, shippingCost, discount, coupon, total } = req.body;

  if (!Array.isArray(items) || !items.length) {
    res.status(400);
    throw new Error("At least one item is required to place an order");
  }

  if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zip || !shippingAddress?.country || !shippingAddress?.phone) {
    res.status(400);
    throw new Error("Complete shipping details are required");
  }

  if (!shippingMethod) {
    res.status(400);
    throw new Error("Shipping method is required");
  }

  if (!Number.isFinite(Number(total)) || Number(total) <= 0) {
    res.status(400);
    throw new Error("Order total must be greater than zero");
  }

  const productIds = items
    .map((item) => item?.product)
    .filter((value) => mongoose.Types.ObjectId.isValid(value));
  const products = await Product.find({ _id: { $in: productIds } }).select("_id");

  if (products.length !== items.length) {
    res.status(400);
    throw new Error("One or more products in the order are invalid");
  }

  const newOrderId = new mongoose.Types.ObjectId();
  let razorpayOrder;

  try {
    razorpayOrder = await createRazorpayOrder({
      amount: Number(total),
      receipt: `order_${newOrderId.toString().slice(-10)}`,
      notes: {
        appOrderId: newOrderId.toString(),
        customerName: shippingAddress.name || req.user.name || "Customer",
      },
    });
  } catch (error) {
    res.status(502);
    throw new Error(error.message || "Unable to initialize Razorpay order");
  }

  const order = await Order.create({
    _id: newOrderId,
    user: req.user._id,
    items,
    shippingAddress,
    shippingMethod,
    subtotal,
    shippingCost,
    discount,
    coupon,
    total,
    paymentMethod: "razorpay",
    paymentStatus: "pending",
    paymentGateway: "razorpay",
    razorpayOrderId: razorpayOrder.id,
  });

  res.status(201).json({
    success: true,
    item: order,
    payment: {
      ...getRazorpayPublicConfig(),
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
    },
  });
});

export const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400);
    throw new Error("Missing payment verification fields");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  const isValid = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    order.paymentStatus = "failed";
    await order.save();
    res.status(400);
    throw new Error("Invalid Razorpay signature");
  }

  order.paymentStatus = "paid";
  order.razorpayOrderId = razorpayOrderId;
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.paidAt = new Date();
  await order.save();

  for (const item of order.items) {
    await Product.updateOne({ _id: item.product }, { $inc: { "variants.0.stock": -item.quantity } }).catch(
      () => null
    );
  }

  res.json({ success: true, item: order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const items = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, items });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const item = await Order.findById(req.params.id).populate("user", "name email");
  if (!item) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (req.user.role !== "admin" && item.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  res.json({ success: true, item });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const items = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, items });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const item = await Order.findByIdAndUpdate(
    req.params.id,
    {
      fulfillmentStatus: req.body.fulfillmentStatus,
      trackingNumber: req.body.trackingNumber ?? "",
      paymentStatus: req.body.paymentStatus,
    },
    { new: true, runValidators: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, item });
});
