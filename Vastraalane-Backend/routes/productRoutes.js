const express = require("express");
const router = express.Router();

const { getProducts, getCategoryCounts } = require("../controllers/productController");

// Public products listing with pagination
router.get("/", getProducts);
router.get("/categories", getCategoryCounts);

module.exports = router;
