import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
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

const PRODUCT_CARD_PROJECTION = [
  "_id",
  "name",
  "slug",
  "category",
  "brand",
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
].join(" ");

const SEARCH_PROJECTION = [
  "_id",
  "name",
  "slug",
  "category",
  "brand",
  "basePrice",
  "price",
  "mrp",
  "originalPrice",
  "salePrice",
  "image",
  "images",
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

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractCategoryName(category) {
  if (typeof category === "string") {
    return category;
  }

  if (category?.name) {
    return category.name;
  }

  if (category?.title) {
    return category.title;
  }

  return "";
}

async function buildCategoryMatchCondition(rawCategory) {
  const requestedValue = String(rawCategory || "").trim();
  if (!requestedValue || requestedValue.toLowerCase() === "all") {
    return null;
  }

  const requestedSlug = slugifyCategory(requestedValue);
  const exactNameRegex = new RegExp(`^${escapeRegex(requestedValue)}$`, "i");
  const clauses = [{ category: exactNameRegex }, { "category.name": exactNameRegex }];

  const categoryDoc = await Category.findOne({ slug: requestedSlug }).select("_id name slug").lean();
  if (categoryDoc) {
    clauses.push(
      { category: categoryDoc.name },
      { category: String(categoryDoc._id) },
      { "category.name": categoryDoc.name },
      { "category.slug": categoryDoc.slug }
    );
  }

  return { $or: clauses };
}

async function buildLegacyCategoryFallbackCondition(requestedSlug) {
  const categories = await Product.distinct("category", {
    category: { $exists: true, $ne: null, $ne: "" },
  });

  const matchedStringCategories = [];
  const matchedObjectCategories = [];

  for (const category of categories) {
    const categoryName = extractCategoryName(category);
    if (!categoryName || slugifyCategory(categoryName) !== requestedSlug) {
      continue;
    }

    if (typeof category === "string") {
      matchedStringCategories.push(category);
      continue;
    }

    matchedObjectCategories.push(categoryName);
    if (category?.slug) {
      matchedObjectCategories.push(category.slug);
    }
  }

  const uniqueStringCategories = Array.from(new Set(matchedStringCategories));
  const uniqueObjectNames = Array.from(new Set(matchedObjectCategories));

  if (!uniqueStringCategories.length && !uniqueObjectNames.length) {
    return null;
  }

  const clauses = [];

  if (uniqueStringCategories.length) {
    clauses.push({ category: { $in: uniqueStringCategories } });
  }

  if (uniqueObjectNames.length) {
    clauses.push(
      { "category.name": { $in: uniqueObjectNames } },
      { "category.slug": requestedSlug }
    );
  }

  return clauses.length ? { $or: clauses } : null;
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

  return andConditions.length ? { $and: andConditions } : {};
}

function buildSort(sort) {
  switch (sort) {
    case "price_asc":
      return { price: 1, salePrice: 1, createdAt: -1 };
    case "price_desc":
      return { price: -1, salePrice: -1, createdAt: -1 };
    case "rating":
      return { "ratings.average": -1 };
    case "newest":
      return { createdAt: -1 };
    default:
      return { isFeatured: -1, createdAt: -1 };
  }
}

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);
  const filters = buildProductQuery(req.query);
  const requestedCategorySlug =
    req.query.category && String(req.query.category).toLowerCase() !== "all"
      ? slugifyCategory(req.query.category)
      : "";
  const categoryCondition = await buildCategoryMatchCondition(req.query.category);
  if (categoryCondition) {
    filters.$and = filters.$and || [];
    filters.$and.push(categoryCondition);
  }

  let [items, total] = await Promise.all([
    Product.find(filters)
      .select(PRODUCT_CARD_PROJECTION)
      .sort(buildSort(req.query.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filters),
  ]);

  if (!items.length && requestedCategorySlug) {
    const fallbackCategoryCondition = await buildLegacyCategoryFallbackCondition(requestedCategorySlug);
    if (fallbackCategoryCondition) {
      const fallbackFilters = buildProductQuery(req.query);
      fallbackFilters.$and = fallbackFilters.$and || [];
      fallbackFilters.$and.push(fallbackCategoryCondition);

      [items, total] = await Promise.all([
        Product.find(fallbackFilters)
          .select(PRODUCT_CARD_PROJECTION)
          .sort(buildSort(req.query.sort))
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(fallbackFilters),
      ]);
    }
  }

  res.set("Cache-Control", "public, max-age=60");
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
    .select(SEARCH_PROJECTION)
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  res.json({ success: true, items: items.map(serializeProduct) });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  let items = await Product.find({ isFeatured: true, $or: [{ isActive: { $exists: false } }, { isActive: true }] })
    .select(PRODUCT_CARD_PROJECTION)
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  if (!items.length) {
    items = await Product.find({ $or: [{ isActive: { $exists: false } }, { isActive: true }] })
      .select(PRODUCT_CARD_PROJECTION)
      .sort({ updatedAt: -1 })
      .limit(12)
      .lean();
  }

  res.set("Cache-Control", "public, max-age=120");
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
