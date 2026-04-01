
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  size: { type: String, default: "M" },
  productId: String,
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
