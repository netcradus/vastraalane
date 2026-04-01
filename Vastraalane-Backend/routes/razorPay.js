const express = require("express");
const router = express.Router();
const orderController = require("../controllers/razorPayController");

router.post("/createOrder", orderController.createOrder);
router.post("/verifyPayment", orderController.verifyPayment);

module.exports = router;

