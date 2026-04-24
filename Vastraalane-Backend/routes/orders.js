import express from "express";
import { createOrder, getMyOrders, getOrderById, verifyOrderPayment } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createOrder);
router.post("/verify-payment", verifyOrderPayment);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);

export default router;
