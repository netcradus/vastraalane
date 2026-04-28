import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { buildPagination } from "../utils/formatters.js";
import { normalizeCatalogProductName } from "../utils/normalizeProductName.js";
import { inferProductAudience } from "../utils/categorizeProduct.js";

function slugifyCategory(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const FLIPFLOPS_CROCS_SLUG = "flipflops-crocs";
const FLIPFLOPS_CROCS_GROUP = ["Flipflops/Crocs", "Loafers"];
const APPAREL_GROUP_SLUG = "cordset-and-tracksuit";
const APPAREL_GROUP = ["Cordset & Tracksuit", "Jeans & Trouser & Trackpant"];

const PRODUCT_LIST_PROJECTION = [
  "_id",
  "name",
  "slug",
  "description",
  "category",
  "brand",
  "tags",
  "basePrice",
  "price",
  "mrp",
  "originalPrice",
  "discountPercent",
  "salePrice",
  "image",
  "images",
  "variants",
  "ratings",
  "isFeatured",
  "isActive",
  "createdAt",
  "updatedAt",
].join(" ");

function humanizeProductTitle(source) {
  const candidates = [source.slug, source.productUrl, source.name];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (!value) continue;

    const cleaned = value
      .replace(/^\/+/, "")
      .replace(/\.html?$/i, "")
      .replace(/^https?:\/\/[^/]+\//i, "")
      .replace(/footshoppers/gi, "")
      .replace(/\b\d{5,}\b/g, "")
      .replace(/\bamp\b/gi, "")
      .replace(/\bhtml\b/gi, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned && cleaned.length > 4) {
      const title = cleaned
        .split(" ")
        .slice(0, 12)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (!/^Premium\s+(Product|Bag)$/i.test(title) || candidate !== source.name) {
        return title;
      }
    }
  }

  return "Product";
}

function normalizeMoney(value = 0) {
  const numericValue = Number(value) || 0;
  return numericValue > 0 && numericValue < 1000000 ? Math.round(numericValue * 100) : numericValue;
}

function normalizeImages(product) {
  const imageCandidates = Array.isArray(product.images) ? product.images : [];
  const normalizedImages = imageCandidates
    .map((image) => {
      if (typeof image === "string") {
        return { url: image, publicId: "" };
      }

      if (image?.url) {
        return { url: image.url, publicId: image.publicId || "" };
      }

      return null;
    })
    .filter(Boolean);

  if (!normalizedImages.length && product.image) {
    normalizedImages.push({ url: product.image, publicId: "" });
  }

  return normalizedImages;
}

function serializeProduct(product) {
  const source = product.toObject ? product.toObject() : product;
  const categoryName =
    typeof source.category === "string"
      ? source.category
      : source.category?.name || source.category?.title || "Uncategorized";
  const basePrice = source.basePrice || source.originalPrice || source.mrp || source.price || 0;
  const salePrice = source.salePrice || source.price || basePrice;
  const normalizedImages = normalizeImages(source);
  const resolvedSlug = source.slug?.startsWith("/") ? source.slug.slice(1) : source.slug || "";
  const humanizedName = humanizeProductTitle(source);
  const displayName = normalizeCatalogProductName(humanizedName, categoryName);
  const normalizedSizes = Array.from(
    new Set(
      [
        ...(Array.isArray(source.sizes) ? source.sizes : []),
        ...(Array.isArray(source.variants) ? source.variants.map((variant) => variant?.size).filter(Boolean) : []),
      ].filter(Boolean)
    )
  );
  const normalizedColors = Array.from(
    new Set(
      [
        ...(Array.isArray(source.colors) ? source.colors : []),
        ...(Array.isArray(source.variants) ? source.variants.map((variant) => variant?.color).filter(Boolean) : []),
      ].filter(Boolean)
    )
  );
  const variants = Array.isArray(source.variants) ? source.variants : [];
  const hasTrackedVariants = variants.some(
    (variant) =>
      variant &&
      (variant.size || variant.color || variant.sku || variant.stock !== undefined)
  );
  const totalStock = variants.reduce((sum, variant) => sum + Math.max(0, Number(variant?.stock) || 0), 0);
  const inStock = hasTrackedVariants ? totalStock > 0 : true;
  const audience = inferProductAudience(source);

  return {
    ...source,
    name: displayName,
    displayName,
    slug: resolvedSlug,
    category: {
      name: categoryName,
      slug: slugifyCategory(categoryName),
    },
    images: normalizedImages,
    image: normalizedImages[0]?.url || "",
    basePrice: normalizeMoney(basePrice),
    salePrice: normalizeMoney(salePrice),
    mrp: normalizeMoney(source.mrp || basePrice),
    originalPrice: normalizeMoney(source.originalPrice || basePrice),
    discountPercent:
      source.discountPercent ||
      (basePrice > 0 ? Math.max(0, Math.round(((basePrice - salePrice) / basePrice) * 100)) : 0),
    description: source.description || source.name,
    variants,
    totalStock,
    inStock,
    audience,
    sizes: normalizedSizes,
    colors: normalizedColors,
    ratings: source.ratings || { average: 0, count: 0 },
    isFeatured: typeof source.isFeatured === "boolean" ? source.isFeatured : false,
    isActive: typeof source.isActive === "boolean" ? source.isActive : true,
  };
}

function buildProductQuery(query, includeInactive = false) {
  const andConditions = [];

  if (!includeInactive) {
    andConditions.push({ $or: [{ isActive: { $exists: false } }, { isActive: true }] });
  }

  if (query.brand) {
    andConditions.push({ brand: { $in: String(query.brand).split(",") } });
  }

  if (query.tags) {
    andConditions.push({ tags: { $in: String(query.tags).split(",") } });
  }

  if (query.price_min || query.price_max) {
    const priceMinPaise = Number(query.price_min || 0);
    const priceMaxPaise = Number(query.price_max || 0);
    const priceMinRupees = priceMinPaise ? Math.floor(priceMinPaise / 100) : 0;
    const priceMaxRupees = priceMaxPaise ? Math.ceil(priceMaxPaise / 100) : 0;

    const paiseCondition = {};
    const rupeeCondition = {};

    if (query.price_min) {
      paiseCondition.$gte = priceMinPaise;
      rupeeCondition.$gte = priceMinRupees;
    }

    if (query.price_max) {
      paiseCondition.$lte = priceMaxPaise;
      rupeeCondition.$lte = priceMaxRupees;
    }

    andConditions.push({
      $or: [
        { salePrice: paiseCondition },
        { basePrice: paiseCondition },
        { price: rupeeCondition },
      ],
    });
  }

  if (query.size) {
    andConditions.push({ "variants.size": { $in: String(query.size).split(",") } });
  }

  if (query.color) {
    andConditions.push({ "variants.color": { $in: String(query.color).split(",") } });
  }

  if (query.audience) {
    const requestedAudience = String(query.audience).toLowerCase();
    const audienceRegex =
      requestedAudience === "women"
        ? /\b(women|womens|lady|ladies|girls|female|for her)\b/i
        : requestedAudience === "men"
          ? /\b(men|mens|gent|gents|boys|male|for him)\b/i
          : null;

    if (audienceRegex) {
      andConditions.push({
        $or: [
          { name: audienceRegex },
          { slug: audienceRegex },
          { description: audienceRegex },
          { brand: audienceRegex },
          { tags: { $elemMatch: { $regex: audienceRegex } } },
        ],
      });
    }
  }

  if (query.subtype && String(query.category).toLowerCase() === FLIPFLOPS_CROCS_SLUG) {
    const requestedSubtype = String(query.subtype).toLowerCase();

    if (requestedSubtype === "loafers") {
      andConditions.push({ category: "Loafers" });
    }

    if (requestedSubtype === "flipflops-crocs") {
      andConditions.push({ category: "Flipflops/Crocs" });
    }
  }

  if (query.subtype && String(query.category).toLowerCase() === APPAREL_GROUP_SLUG) {
    const requestedSubtype = String(query.subtype).toLowerCase();

    if (requestedSubtype === "cordset-and-tracksuit") {
      andConditions.push({ category: "Cordset & Tracksuit" });
    }

    if (requestedSubtype === "jeans-and-trouser-and-trackpant") {
      andConditions.push({ category: "Jeans & Trouser & Trackpant" });
    }
  }

  return andConditions.length ? { $and: andConditions } : {};
}

function buildSort(sort) {
  switch (sort) {
    case "price_asc":
      return { price: 1, salePrice: 1, createdAt: -1, _id: -1 };
    case "price_desc":
      return { price: -1, salePrice: -1, createdAt: -1, _id: -1 };
    case "rating":
      return { "ratings.average": -1, createdAt: -1, _id: -1 };
    case "newest":
      return { createdAt: -1, _id: -1 };
    default:
      return { isFeatured: -1, createdAt: -1, _id: -1 };
  }
}

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);
  const filters = buildProductQuery(req.query);
  if (req.query.category && String(req.query.category).toLowerCase() !== "all") {
    const requestedSlug = slugifyCategory(req.query.category);
    const categories = await Product.distinct("category", { category: { $exists: true, $ne: null, $ne: "" } });
    const matchedCategories =
      requestedSlug === FLIPFLOPS_CROCS_SLUG
        ? categories.filter((category) => FLIPFLOPS_CROCS_GROUP.includes(String(category)))
        : requestedSlug === APPAREL_GROUP_SLUG
          ? categories.filter((category) => APPAREL_GROUP.includes(String(category)))
        : categories.filter((category) => slugifyCategory(category) === requestedSlug);

    filters.$and = filters.$and || [];
    filters.$and.push({
      category: { $in: matchedCategories.length ? matchedCategories : ["__no_match__"] },
    });
  }

  const [items, total] = await Promise.all([
    Product.find(filters)
      .select(PRODUCT_LIST_PROJECTION)
      .sort(buildSort(req.query.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filters),
  ]);

  res.json({
    success: true,
    items: items.map(serializeProduct),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) {
    return res.json({ success: true, items: [] });
  }

  const items = await Product.find({
    $and: [
      { $or: [{ isActive: { $exists: false } }, { isActive: true }] },
      {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
          { brand: { $regex: q, $options: "i" } },
          { tags: { $elemMatch: { $regex: q, $options: "i" } } },
        ],
      },
    ],
  })
    .select(PRODUCT_LIST_PROJECTION)
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  res.json({ success: true, items: items.map(serializeProduct) });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  let items = await Product.find({ isFeatured: true, $or: [{ isActive: { $exists: false } }, { isActive: true }] })
    .select(PRODUCT_LIST_PROJECTION)
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  if (!items.length) {
    items = await Product.find({ $or: [{ isActive: { $exists: false } }, { isActive: true }] })
      .select(PRODUCT_LIST_PROJECTION)
      .sort({ updatedAt: -1 })
      .limit(12)
      .lean();
  }

  res.json({ success: true, items: items.map(serializeProduct) });
});

export const getProductById = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id).lean();

  if (!item) {
    res.status(404);
    throw new Error("Product not found");
  }

  const serializedItem = serializeProduct(item);
  const related = await Product.find({
    _id: { $ne: item._id },
    category: item.category,
    $or: [{ isActive: { $exists: false } }, { isActive: true }],
  })
    .limit(8)
    .select("name slug images image salePrice basePrice price originalPrice mrp ratings category")
    .lean();

  res.json({ success: true, item: serializedItem, related: related.map(serializeProduct) });
});

export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { rating, comment } = req.body;
  const existingReview = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    res.status(400);
    throw new Error("You already reviewed this product");
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.ratings.count = product.reviews.length;
  product.ratings.average =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ success: true, item: product });
});
