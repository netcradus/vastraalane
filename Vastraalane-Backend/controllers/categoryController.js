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

const FLIPFLOPS_CROCS_GROUP = {
  name: "Flipflops/Crocs",
  slug: "flipflops-crocs",
  sourceCategories: ["Flipflops/Crocs", "Loafers"],
};

const APPAREL_GROUP = {
  name: "Cordset & Tracksuit",
  slug: "cordset-and-tracksuit",
  sourceCategories: ["Cordset & Tracksuit", "Jeans & Trouser & Trackpant"],
};

function mergeGroupedCategories(groupedEntries = []) {
  const mergedItems = [];
  let combinedFlipflopsCrocs = null;
  let combinedApparel = null;

  for (const entry of groupedEntries) {
    const name = String(entry._id || entry.name || "");

    if (name === "Other") {
      continue;
    }

    const fallbackImage = Array.isArray(entry.images) ? entry.images[0] : "";
    const fallbackImageUrl =
      typeof fallbackImage === "string" ? fallbackImage : fallbackImage?.url || fallbackImage?.path || "";

    if (FLIPFLOPS_CROCS_GROUP.sourceCategories.includes(name)) {
      combinedFlipflopsCrocs = combinedFlipflopsCrocs || {
        _id: FLIPFLOPS_CROCS_GROUP.slug,
        name: FLIPFLOPS_CROCS_GROUP.name,
        slug: FLIPFLOPS_CROCS_GROUP.slug,
        image: "",
        productCount: 0,
      };

      combinedFlipflopsCrocs.productCount += entry.productCount || 0;
      if (!combinedFlipflopsCrocs.image) {
        combinedFlipflopsCrocs.image = fallbackImageUrl || entry.image || "";
      }
      continue;
    }

    if (APPAREL_GROUP.sourceCategories.includes(name)) {
      combinedApparel = combinedApparel || {
        _id: APPAREL_GROUP.slug,
        name: APPAREL_GROUP.name,
        slug: APPAREL_GROUP.slug,
        image: "",
        productCount: 0,
      };

      combinedApparel.productCount += entry.productCount || 0;
      if (!combinedApparel.image) {
        combinedApparel.image = fallbackImageUrl || entry.image || "";
      }
      continue;
    }

    mergedItems.push({
      _id: entry._id || name,
      name,
      slug: entry.slug || slugifyCategory(name),
      image: fallbackImageUrl || entry.image || "",
      productCount: entry.productCount || 0,
    });
  }

  if (combinedFlipflopsCrocs) {
    mergedItems.push(combinedFlipflopsCrocs);
  }

  if (combinedApparel) {
    mergedItems.push(combinedApparel);
  }

  return mergedItems.sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));
}

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  if (categories.length) {
    const counts = await Product.aggregate([{ $group: { _id: "$category", productCount: { $sum: 1 } } }]);
    const countMap = new Map(counts.map((entry) => [String(entry._id).trim().toLowerCase(), entry.productCount]));
    const enriched = categories
      .map((item) => ({
        ...item,
        productCount: countMap.get(String(item.name || "").trim().toLowerCase()) || 0,
      }))
      .filter((item) => item.productCount > 0 && String(item.name || "").trim().toLowerCase() !== "other")
      .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));

    return res.json({
      success: true,
      items: mergeGroupedCategories(
        enriched.map((item) => ({
          _id: item.name,
          name: item.name,
          slug: item.slug,
          image: item.image,
          images: [item.image],
          productCount: item.productCount,
        }))
      ),
    });
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

  const items = grouped
    .map((entry) => ({
      ...entry,
      name: entry._id,
      slug: slugifyCategory(entry._id),
    }));

  res.json({ success: true, items: mergeGroupedCategories(items) });
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
