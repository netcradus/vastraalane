const express = require("express");
const router = express.Router();

const { getProducts } = require("../controllers/productController");

// Public products listing with pagination
router.get("/", getProducts);

module.exports = router;

