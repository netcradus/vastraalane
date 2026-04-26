import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000;
let categoryCache = { expiresAt: 0, payload: null };

function slugifyCategory(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readCategoryCache() {
  if (categoryCache.payload && categoryCache.expiresAt > Date.now()) {
    return categoryCache.payload;
  }

  return null;
}

function writeCategoryCache(payload) {
  categoryCache = {
    payload,
    expiresAt: Date.now() + CATEGORY_CACHE_TTL_MS,
  };
}

function clearCategoryCache() {
  categoryCache = { expiresAt: 0, payload: null };
}

export const getCategories = asyncHandler(async (req, res) => {
  const cachedPayload = readCategoryCache();
  if (cachedPayload) {
    res.set("Cache-Control", "public, max-age=300");
    return res.json(cachedPayload);
  }

  const categories = await Category.find().select("name slug image").sort({ name: 1 }).lean();

  if (categories.length) {
    const counts = await Product.aggregate([
      {
        $match: {
          $or: [{ isActive: { $exists: false } }, { isActive: true }],
          category: { $exists: true, $ne: null, $ne: "" },
        },
      },
      { $group: { _id: "$category", productCount: { $sum: 1 } } },
    ]);

    const countMapByName = new Map();
    const countMapBySlug = new Map();

    for (const entry of counts) {
      if (typeof entry._id === "string") {
        countMapByName.set(entry._id, entry.productCount);
        countMapBySlug.set(slugifyCategory(entry._id), entry.productCount);
        continue;
      }

      if (entry._id?.name) {
        countMapByName.set(entry._id.name, entry.productCount);
      }

      if (entry._id?.slug) {
        countMapBySlug.set(entry._id.slug, entry.productCount);
      }
    }

    const enriched = categories.map((item) => ({
      ...item,
      productCount: countMapBySlug.get(item.slug) || countMapByName.get(item.name) || 0,
    }));

    const payload = { success: true, items: enriched };
    writeCategoryCache(payload);
    res.set("Cache-Control", "public, max-age=300");
    return res.json(payload);
  }

  const grouped = await Product.aggregate([
    {
      $match: {
        $or: [{ isActive: { $exists: false } }, { isActive: true }],
        category: { $exists: true, $ne: null, $ne: "" },
      },
    },
    {
      $group: {
        _id: "$category",
        productCount: { $sum: 1 },
        image: { $first: "$image" },
        images: { $first: "$images" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const items = grouped.map((entry) => {
    const fallbackImage = Array.isArray(entry.images) ? entry.images[0] : "";
    const fallbackImageUrl =
      typeof fallbackImage === "string" ? fallbackImage : fallbackImage?.url || fallbackImage?.path || "";
    return {
      _id: entry._id,
      name: entry._id,
      slug: slugifyCategory(entry._id),
      image: fallbackImageUrl || entry.image || "",
      productCount: entry.productCount,
    };
  });

  const payload = { success: true, items };
  writeCategoryCache(payload);
  res.set("Cache-Control", "public, max-age=300");
  res.json(payload);
});

export const createCategory = asyncHandler(async (req, res) => {
  const item = await Category.create(req.body);
  clearCategoryCache();
  res.status(201).json({ success: true, item });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    res.status(404);
    throw new Error("Category not found");
  }
  clearCategoryCache();
  res.json({ success: true, item });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const item = await Category.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Category not found");
  }

  const uncategorized = await Category.findOneAndUpdate(
    { slug: "uncategorized" },
    { name: "Uncategorized", slug: "uncategorized" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Product.updateMany({ category: item._id }, { category: uncategorized._id });
  await item.deleteOne();
  clearCategoryCache();

  res.json({ success: true, message: "Category deleted" });
});
