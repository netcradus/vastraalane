const mongoose = require("mongoose");

function compactUniqueStrings(values) {
  if (!Array.isArray(values)) return [];
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const normalized = String(value || "").trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function normalizeUrlForIdentity(value) {
  if (!value) return "";

  try {
    const parsed = new URL(String(value).trim());
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return String(value).trim().replace(/\/+$/, "");
  }
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeBrand(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildIdentityKey(doc) {
  const slug = String(doc.slug || "").trim().toLowerCase();
  const productUrl = normalizeUrlForIdentity(doc.productUrl);
  const name = normalizeText(doc.name);

  if (slug) return `slug:${slug}`;
  if (productUrl) return `url:${productUrl}`;
  return `name:${name}`;
}

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },

    // Selling price (e.g., "Rs 2499.00")
    price: { type: Number, required: true },

    // Crossed-out price if available (e.g., "Rs 46999.00")
    mrp: { type: Number },
    originalPrice: { type: Number },

    // External CDN image URLs
    images: { type: [String], default: [] },
    // Back-compat if UI expects a single image
    image: { type: String },

    category: { type: String },
    brandName: { type: String, index: true },
    brand_name: { type: String },

    // Available sizes (e.g., [ "6", "7", "8" ] or [ "S", "M" ])
    sizes: [{ type: String }],

    description: { type: String },

    // Card link from listing page (and/or detail page slug)
    productUrl: { type: String, index: true },
    slug: { type: String, index: true },
    identityKey: { type: String, required: true },
  },
  { timestamps: true }
);

ProductSchema.index({ identityKey: 1 }, { unique: true });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ price: 1, createdAt: -1 });
ProductSchema.index({ price: -1, createdAt: -1 });

ProductSchema.pre("validate", function normalizeProduct(next) {
  this.name = String(this.name || "").trim();
  this.slug = String(this.slug || "").trim().toLowerCase() || undefined;
  this.productUrl = normalizeUrlForIdentity(this.productUrl) || undefined;
  this.description = String(this.description || "").trim() || undefined;
  this.category = String(this.category || "").trim() || undefined;
  this.brandName = normalizeBrand(this.brandName || this.brand_name) || undefined;
  this.brand_name = this.brandName;
  this.images = compactUniqueStrings([
    ...(Array.isArray(this.images) ? this.images : []),
    this.image,
  ]);
  this.image = this.images[0] || undefined;
  this.sizes = compactUniqueStrings(this.sizes);
  this.identityKey = buildIdentityKey(this);
  next();
});

module.exports = mongoose.model("Product", ProductSchema);

