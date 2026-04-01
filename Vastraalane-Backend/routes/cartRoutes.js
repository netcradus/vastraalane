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

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.delete("/clear", cartController.clearCart);
router.delete("/:id", cartController.removeFromCart);

module.exports = router;
