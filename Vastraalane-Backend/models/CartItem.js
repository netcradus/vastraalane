const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // for product image
  size: { type: String },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("CartItem", CartItemSchema);
