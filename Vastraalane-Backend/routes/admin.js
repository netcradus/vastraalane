import express from "express";
import { getAdminDashboard } from "../controllers/adminDashboardController.js";
import {
  bulkStockUpdate,
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  updateProduct,
} from "../controllers/adminProductController.js";
import { deleteCoupon, getCoupons, createCoupon, updateCoupon } from "../controllers/couponController.js";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { deleteUser, getAllUsers, updateUserRole } from "../controllers/userController.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(authAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/products", getAdminProducts);
router.post("/products", upload.array("images", 8), createProduct);
router.get("/products/:id", getAdminProductById);
router.put("/products/:id", upload.array("images", 8), updateProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/stock/bulk", bulkStockUpdate);

router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

export default router;
