import express from "express";
import {
  createReview,
  getFeaturedProducts,
  getProductById,
  getProducts,
  searchProducts,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, createReview);

export default router;
