const Product = require("../models/Product");
const {
  getAllCategoryMeta,
  getCategoryMetaById,
  getCategoryMetaBySourceName,
} = require("../utils/categoryMetadata");

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getCategoryAliases(category) {
  const categoryMeta = getCategoryMetaById(category) || getCategoryMetaBySourceName(category);
  if (!categoryMeta) return [String(category || "").trim()].filter(Boolean);
  return categoryMeta.sourceCategories;
}

function normalizeProductResponse(product) {
  const images = Array.from(
    new Set(
      [product?.image, ...(Array.isArray(product?.images) ? product.images : [])]
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    )
  );

  const categoryMeta = getCategoryMetaBySourceName(product?.category);

  return {
    ...product,
    images,
    image: images[0] || null,
    brandName: product?.brandName || product?.brand_name || null,
    brand_name: product?.brandName || product?.brand_name || null,
    categoryId: categoryMeta?.id || null,
    categoryLabel: categoryMeta?.label || product?.category || null,
  };
}

function buildProductFilter(req) {
  const search = (req.query.search || "").toString().trim();
  const category = (req.query.category || "").toString().trim();
  const categoryId = (req.query.categoryId || req.params.categoryId || "").toString().trim();
  const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brandName: { $regex: search, $options: "i" } },
      { brand_name: { $regex: search, $options: "i" } },
    ];
  }

  const categoryAliases = getCategoryAliases(categoryId || category);
  if (categoryAliases.length) {
    filter.category = { $in: categoryAliases };
  }

  if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
    filter.price = {};
    if (Number.isFinite(minPrice)) filter.price.$gte = minPrice;
    if (Number.isFinite(maxPrice)) filter.price.$lte = maxPrice;
  }

  return filter;
}

function getSortSpec(sort) {
  const sortKey = String(sort || "featured").trim().toLowerCase();
  if (sortKey === "low-high") return { price: 1, createdAt: -1 };
  if (sortKey === "high-low") return { price: -1, createdAt: -1 };
  if (sortKey === "rating") return { price: -1, createdAt: -1 };
  return { createdAt: -1 };
}

async function fetchProducts(req, res, extraFilter = {}) {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const wantsAll =
      String(req.query.all || "").toLowerCase() === "true" ||
      String(req.query.limit || "").toLowerCase() === "all";
    const limit = wantsAll ? null : Math.min(120, Math.max(1, toInt(req.query.limit, 24)));

    const filter = {
      ...buildProductFilter(req),
      ...extraFilter,
    };

    const totalItems = await Product.countDocuments(filter);
    const sortSpec = getSortSpec(req.query.sort);
    const skip = wantsAll || !limit ? 0 : (page - 1) * limit;

    let query = Product.find(filter).sort(sortSpec).allowDiskUse(true).skip(skip);
    if (!wantsAll && limit !== null) {
      query = query.limit(limit);
    }

    const products = (await query.lean()).map(normalizeProductResponse);
    const totalPages = wantsAll || !limit ? 1 : Math.max(1, Math.ceil(totalItems / limit));

    return res.json({
      products,
      page,
      limit: wantsAll ? totalItems : limit,
      totalItems,
      totalPages,
      showingFrom: totalItems === 0 ? 0 : skip + 1,
      showingTo: totalItems === 0 ? 0 : skip + products.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}

exports.getProducts = async (req, res) => fetchProducts(req, res);

exports.getProductsByCategory = async (req, res) => {
  const categoryMeta = getCategoryMetaById(req.params.categoryId);

  if (!categoryMeta) {
    return res.status(404).json({ message: "Category not found" });
  }

  return fetchProducts(req, res, {
    category: { $in: categoryMeta.sourceCategories },
  });
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ product: normalizeProductResponse(product) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
};

exports.getCategories = async (_req, res) => {
  try {
    const counts = await Product.aggregate([
      { $match: { category: { $exists: true, $ne: null, $ne: "" } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          categoryImage: { $first: { $ifNull: ["$image", { $arrayElemAt: ["$images", 0] }] } },
        },
      },
    ]);

    const countsByCategory = new Map(counts.map((item) => [String(item._id), item]));

    const categories = getAllCategoryMeta()
      .map((meta) => {
        const matchedEntries = meta.sourceCategories
          .map((sourceCategory) => countsByCategory.get(sourceCategory))
          .filter(Boolean);

        const productCount = matchedEntries.reduce((sum, item) => sum + Number(item.count || 0), 0);
        if (!productCount) return null;

        const representative =
          matchedEntries.find((item) => item.categoryImage)?.categoryImage || null;

        return {
          _id: meta.id,
          slug: meta.id,
          name: meta.name,
          label: meta.label,
          sourceCategories: meta.sourceCategories,
          productCount,
          imageUrl: representative,
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.productCount - left.productCount || left.name.localeCompare(right.name));

    return res.json({ categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categoryMeta = getCategoryMetaById(req.params.categoryId);
    if (!categoryMeta) {
      return res.status(404).json({ message: "Category not found" });
    }

    const stats = await Product.aggregate([
      { $match: { category: { $in: categoryMeta.sourceCategories } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: null,
          productCount: { $sum: 1 },
          imageUrl: { $first: { $ifNull: ["$image", { $arrayElemAt: ["$images", 0] }] } },
        },
      },
    ]);

    const summary = stats[0];
    if (!summary?.productCount) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({
      category: {
        _id: categoryMeta.id,
        slug: categoryMeta.id,
        name: categoryMeta.name,
        label: categoryMeta.label,
        sourceCategories: categoryMeta.sourceCategories,
        productCount: Number(summary.productCount || 0),
        imageUrl: summary.imageUrl || null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch category" });
  }
};
