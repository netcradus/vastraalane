const express = require("express");
const router = express.Router();

const {
  getProducts,
  getCategories,
  getCategoryById,
  getProductsByCategory,
  getProductById,
} = require("../controllers/productController");

// Public products listing with pagination
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/categories/:categoryId", getCategoryById);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);

module.exports = router;
