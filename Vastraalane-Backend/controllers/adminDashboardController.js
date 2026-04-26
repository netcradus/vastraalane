import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [orderSummary, totalProducts, totalUsers, recentOrders, lowStockProducts] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ["$total", 0] } },
          totalOrders: { $sum: 1 },
        },
      },
    ]),
    Product.countDocuments(),
    User.countDocuments(),
    Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(6)
      .select("total user createdAt paymentStatus fulfillmentStatus")
      .lean(),
    Product.find({ "variants.stock": { $gt: 0, $lt: 10 } })
      .sort({ updatedAt: -1 })
      .limit(6)
      .select("name variants category updatedAt")
      .lean(),
  ]);

  const summary = orderSummary[0] || { totalRevenue: 0, totalOrders: 0 };

  res.json({
    success: true,
    item: {
      totalRevenue: Number(summary.totalRevenue) || 0,
      totalOrders: Number(summary.totalOrders) || 0,
      totalProducts,
      totalUsers,
      recentOrders,
      lowStockProducts,
    },
  });
});
