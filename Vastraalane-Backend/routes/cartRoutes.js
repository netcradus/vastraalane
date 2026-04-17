// const express = require("express");
// const router = express.Router();
// const cartController = require("../controllers/cartController");

// // GET /cart
// router.get("/", cartController.getCart);

// // POST /cart
// router.post("/", cartController.addToCart);

// // DELETE /cart/:id
// router.delete("/:id", cartController.removeFromCart);

// router.delete("/clear", cartController.clearCart);

// module.exports = router;
// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateToken = require("../middleware/authmiddleware");

router.get("/", authenticateToken, cartController.getCart);
router.post("/", authenticateToken, cartController.addToCart);
router.delete("/clear", authenticateToken, cartController.clearCart);
router.delete("/:id", authenticateToken, cartController.removeFromCart);

module.exports = router;
