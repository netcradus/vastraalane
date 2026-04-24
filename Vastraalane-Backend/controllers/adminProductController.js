import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { buildPagination } from "../utils/formatters.js";
import { normalizeCatalogProductName } from "../utils/normalizeProductName.js";

function slugifyCategory(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeMoney(value = 0) {
  const numericValue = Number(value) || 0;
  return numericValue > 0 && numericValue < 1000000 ? Math.round(numericValue * 100) : numericValue;
}

function serializeProduct(product) {
  const source = product.toObject ? product.toObject() : product;
  const categoryName = typeof source.category === "string" ? source.category : source.category?.name || "Uncategorized";
  const rawImages = Array.isArray(source.images) ? source.images : [];
  const images = rawImages.map((image) => (typeof image === "string" ? { url: image } : image));
  if (!images.length && source.image) {
    images.push({ url: source.image });
  }

  const variants = Array.isArray(source.variants) ? source.variants : [];

  return {
    ...source,
    category: { name: categoryName, slug: slugifyCategory(categoryName) },
    images,
    basePrice: normalizeMoney(source.basePrice || source.originalPrice || source.mrp || source.price || 0),
    salePrice: normalizeMoney(source.salePrice || source.price || source.basePrice || 0),
    stock: variants.reduce((sum, variant) => sum + (variant.stock || 0), 0),
    size: variants[0]?.size || "",
    color: variants[0]?.color || "",
  };
}

function normalizeProductBody(body) {
  const size = String(body.size || "").trim();
  const color = String(body.color || "").trim();
  const hasStockField = body.stock !== undefined && body.stock !== null && String(body.stock).trim() !== "";
  const stock = hasStockField ? Number(body.stock || 0) : 0;
  const basePriceValue = Number(body.basePrice || 0);
  const salePriceValue = Number(body.salePrice || 0);
  const nextBody = {
    ...body,
    isFeatured:
      typeof body.isFeatured === "string" ? body.isFeatured === "true" : Boolean(body.isFeatured),
    isActive:
      typeof body.isActive === "string" ? body.isActive !== "false" : body.isActive !== false,
    category: String(body.category || "").trim(),
    basePrice: basePriceValue,
    salePrice: salePriceValue || basePriceValue,
    discountPercent: Number(body.discountPercent || 0),
    tags: Array.isArray(body.tags)
      ? body.tags
      : String(body.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
  };

  nextBody.name = normalizeCatalogProductName(nextBody.name, nextBody.category);

  if (size || color || hasStockField) {
    nextBody.variants = [
      {
        size,
        color,
        stock,
      },
    ];
  }

  return nextBody;
}

async function resolveUploadedImages(files = []) {
  return files
    .map((file) => ({
      url: file.path,
      publicId: file.filename || "",
    }))
    .filter((image) => image.url);
}

export const getAdminProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query.page, req.query.limit || 10);
  const filters = {};

  if (req.query.category) filters.category = req.query.category;
  if (req.query.status === "in") filters["variants.stock"] = { $gt: 10 };
  if (req.query.status === "low") filters["variants.stock"] = { $gt: 0, $lt: 10 };
  if (req.query.status === "out") filters["variants.stock"] = 0;
  if (req.query.search) filters.name = { $regex: req.query.search, $options: "i" };

  const [items, total] = await Promise.all([
    Product.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filters),
  ]);

  res.json({
    success: true,
    items: items.map(serializeProduct),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
});

export const getAdminProductById = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id).lean();
  if (!item) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, item: serializeProduct(item) });
});

export const createProduct = asyncHandler(async (req, res) => {
  const uploadedImages = await resolveUploadedImages(req.files || []);
  const normalizedBody = normalizeProductBody(req.body);
  const payload = {
    ...normalizedBody,
    ...(uploadedImages.length
      ? {
          images: uploadedImages,
          image: uploadedImages[0]?.url || "",
        }
      : {}),
  };

  const item = await Product.create(payload);
  res.status(201).json({ success: true, item });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const uploadedImages = await resolveUploadedImages(req.files || []);
  const normalizedBody = normalizeProductBody(req.body);
  const payload = {
    ...normalizedBody,
    ...(uploadedImages.length
      ? {
          images: uploadedImages,
          image: uploadedImages[0]?.url || "",
        }
      : {}),
  };

  const item = await Product.findByIdAndUpdate(
    req.params.id,
    payload,
    { new: true, runValidators: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, item });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Product not found");
  }

  await item.deleteOne();
  res.json({ success: true, message: "Product deleted" });
});

export const bulkStockUpdate = asyncHandler(async (req, res) => {
  const updates = Array.isArray(req.body.updates) ? req.body.updates : [];

  for (const update of updates) {
    await Product.updateOne(
      { "variants.sku": update.sku },
      { $set: { "variants.$.stock": Number(update.stock) } }
    );
  }

  res.json({ success: true, updated: updates.length });
});
