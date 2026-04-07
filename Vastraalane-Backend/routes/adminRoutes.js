const express = require("express");

const { cleanBrands } = require("../controllers/adminController");

const router = express.Router();

router.patch("/clean-brands", cleanBrands);

module.exports = router;
