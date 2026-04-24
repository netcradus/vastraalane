import mongoose from "mongoose";

const mixedSchema = new mongoose.Schema({}, { _id: false, strict: false });

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    colorHex: { type: String, default: "#d4a373" },
    stock: { type: Number, default: 0 },
    sku: { type: String, default: "" },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.Mixed, default: "" },
    brand: { type: String, default: "" },
    tags: [{ type: String }],
    basePrice: { type: Number, default: 0, min: 0 },
    price: { type: Number, default: 0, min: 0 },
    mrp: { type: Number, default: 0, min: 0 },
    originalPrice: { type: Number, default: 0, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    salePrice: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    images: { type: [mongoose.Schema.Types.Mixed], default: [] },
    modelUrl: { type: String, default: "" },
    variants: [variantSchema],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    weight: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", brand: "text", tags: "text" });
productSchema.index({ isActive: 1, isFeatured: -1, createdAt: -1 });
productSchema.index({ isActive: 1, category: 1, createdAt: -1 });
productSchema.index({ isActive: 1, updatedAt: -1 });

productSchema.pre("save", function updateSalePrice(next) {
  const resolvedBasePrice = this.basePrice || this.originalPrice || this.mrp || this.price || 0;
  const resolvedSalePrice = this.price || this.salePrice || resolvedBasePrice;

  this.basePrice = resolvedBasePrice;
  this.salePrice = resolvedSalePrice;
  this.discountPercent =
    resolvedBasePrice > 0
      ? Math.max(0, Math.round(((resolvedBasePrice - resolvedSalePrice) / resolvedBasePrice) * 100))
      : this.discountPercent;

  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
