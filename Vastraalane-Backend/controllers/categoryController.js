import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

function slugifyCategory(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  if (categories.length) {
    const counts = await Product.aggregate([{ $group: { _id: "$category", productCount: { $sum: 1 } } }]);
    const countMap = new Map(counts.map((entry) => [String(entry._id), entry.productCount]));
    const enriched = categories.map((item) => ({
      ...item,
      productCount: countMap.get(String(item._id)) || 0,
    }));

    return res.json({ success: true, items: enriched });
  }

  const grouped = await Product.aggregate([
    {
      $match: {
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

  res.json({ success: true, items });
});

export const createCategory = asyncHandler(async (req, res) => {
  const item = await Category.create(req.body);
  res.status(201).json({ success: true, item });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    res.status(404);
    throw new Error("Category not found");
  }
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

  res.json({ success: true, message: "Category deleted" });
});
