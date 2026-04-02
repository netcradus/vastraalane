const mongoose = require("mongoose");

// Product catalog schema used for seeding scraped items.
// Note: keep fields permissive so we don't block seeding when the scraper
// can't find optional attributes (e.g., description or sizes).
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },

    // Selling price (e.g., "Rs 2499.00")
    price: { type: Number, required: true },

    // Crossed-out price if available (e.g., "Rs 46999.00")
    mrp: { type: Number },
    originalPrice: { type: Number },

    // External CDN image URLs
    images: [{ type: String }],
    // Back-compat if UI expects a single image
    image: { type: String },

    category: { type: String },

    // Available sizes (e.g., [ "6", "7", "8" ] or [ "S", "M" ])
    sizes: [{ type: String }],

    description: { type: String },

    // Card link from listing page (and/or detail page slug)
    productUrl: { type: String },
    slug: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

