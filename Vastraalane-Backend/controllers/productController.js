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

function isCompactResponse(req) {
  return String(req.query.compact || "").trim().toLowerCase() === "true";
}

function anyFieldRegex(regex) {
  return [{ name: regex }, { slug: regex }, { productUrl: regex }];
}

function buildCategorySafetyFilter(categoryId) {
  const id = String(categoryId || "").trim().toLowerCase();

  // Guardrails for known misclassification patterns in source data.
  const watchKeywords =
    /\b(watch|rolex|omega|hublot|tissot|patek|audemars|chronograph|moonwatch|daytona|nautilus|speedmaster|seamaster|datejust|oyster|quartz)\b/i;
  const shoeKeywords =
    /\b(shoe|shoes|sneaker|sneakers|trainer|running|air ?force|yeezy|jordan|onitsuka|hoka|new ?balance|adidas|nike|puma|boot|boots|dunk|gazelle|samba)\b|adid[\W_]*as|nik[\W_]*e|pum[\W_]*a/i;
  const loaferKeywords = /\b(loafer|loafers|moccasin|moccasins|driving shoe|boat shoe|loro piana)\b/i;
  const sandalKeywords =
    /\b(sandal|sandals|jutti|slipper|slippers|sleepers|slide|slides|flip ?flop|crocs|chappal|heel|heels|mule|mules|kolhapuri)\b/i;
  const shirtKeywords =
    /\b(shirt|shirts|t-?shirt|tshirts?|tee|polo|hoodie|sweatshirt|jersey)\b/i;
  const perfumeKeywords =
    /\b(perfume|parfum|fragrance|gift set|cologne|eau de|edp|edt|pour homme|pour femme|sandalwood|acqua[\s-]*di[\s-]*gio|because[\s-]*its[\s-]*you|in[\s-]*love[\s-]*with[\s-]*you|stronger[\s-]*with[\s-]*you|si[\s-]*passione|code[\s-]*black[\s-]*eau)\b/i;
  const bagKeywords =
    /\b(handbag|handbags|tote|wallet|backpack|crossbody|sling bag|shoulder bag|satchel|clutch|purse|duffle|duffel|bagpack|messenger bag|camera bag|keepall|speedy|neverfull)\b/i;
  const sunglassesKeywords =
    /\b(sunglass|sunglasses|aviator|wayfarer|eyewear|frames?)\b/i;
  const cordsetKeywords =
    /\b(cordset|track suit|tracksuit|co-ord|coord set|matching set|two piece set)\b/i;
  const jeansKeywords =
    /\b(jeans|trouser|trousers|trackpant|track pant|cargo pant|jogger|joggers|pants?)\b/i;

  if (id === "shirts") {
    return {
      $and: [
        { $or: anyFieldRegex(shirtKeywords) },
        { $nor: [...anyFieldRegex(watchKeywords), ...anyFieldRegex(shoeKeywords), ...anyFieldRegex(sandalKeywords), ...anyFieldRegex(perfumeKeywords), ...anyFieldRegex(bagKeywords)] },
      ],
    };
  }

  if (id === "luxury") {
    return {
      $and: [
        { $or: anyFieldRegex(watchKeywords) },
        {
          $nor: [
            ...anyFieldRegex(perfumeKeywords),
            ...anyFieldRegex(shoeKeywords),
            ...anyFieldRegex(sandalKeywords),
            ...anyFieldRegex(sunglassesKeywords),
            ...anyFieldRegex(bagKeywords),
            ...anyFieldRegex(shirtKeywords),
          ],
        },
      ],
    };
  }

  if (id === "perfumes") {
    return {
      $and: [
        { $or: anyFieldRegex(perfumeKeywords) },
        { $nor: [...anyFieldRegex(watchKeywords), ...anyFieldRegex(shoeKeywords), ...anyFieldRegex(sandalKeywords), ...anyFieldRegex(bagKeywords), ...anyFieldRegex(shirtKeywords)] },
      ],
    };
  }

  if (id === "handbags") {
    return {
      $and: [
        { $or: anyFieldRegex(bagKeywords) },
        { $nor: [...anyFieldRegex(watchKeywords), ...anyFieldRegex(shoeKeywords), ...anyFieldRegex(sandalKeywords), ...anyFieldRegex(perfumeKeywords), ...anyFieldRegex(shirtKeywords)] },
      ],
    };
  }

  if (id === "sunglasses") {
    return {
      $and: [
        { $or: anyFieldRegex(sunglassesKeywords) },
        { $nor: [...anyFieldRegex(watchKeywords), ...anyFieldRegex(shoeKeywords), ...anyFieldRegex(sandalKeywords), ...anyFieldRegex(perfumeKeywords), ...anyFieldRegex(bagKeywords), ...anyFieldRegex(shirtKeywords)] },
      ],
    };
  }

  if (id === "sandals") {
    return {
      $and: [
        { $or: anyFieldRegex(sandalKeywords) },
        {
          $nor: [
            ...anyFieldRegex(loaferKeywords),
            ...anyFieldRegex(shirtKeywords),
            ...anyFieldRegex(watchKeywords),
            ...anyFieldRegex(perfumeKeywords),
            ...anyFieldRegex(bagKeywords),
          ],
        },
      ],
    };
  }

  if (id === "shoes") {
    return {
      $and: [
        { $or: anyFieldRegex(shoeKeywords) },
        { $nor: [...anyFieldRegex(watchKeywords), ...anyFieldRegex(perfumeKeywords), ...anyFieldRegex(bagKeywords), ...anyFieldRegex(sunglassesKeywords), ...anyFieldRegex(shirtKeywords)] },
      ],
    };
  }

  if (id === "loafers") {
    return {
      $and: [
        { $or: anyFieldRegex(loaferKeywords) },
        {
          $nor: [
            ...anyFieldRegex(sandalKeywords),
            ...anyFieldRegex(shoeKeywords),
            ...anyFieldRegex(watchKeywords),
            ...anyFieldRegex(perfumeKeywords),
            ...anyFieldRegex(shirtKeywords),
            ...anyFieldRegex(bagKeywords),
          ],
        },
      ],
    };
  }

  if (id === "jeans") {
    return {
      $and: [
        { $or: anyFieldRegex(jeansKeywords) },
        { $nor: [...anyFieldRegex(watchKeywords), ...anyFieldRegex(shoeKeywords), ...anyFieldRegex(sandalKeywords), ...anyFieldRegex(perfumeKeywords), ...anyFieldRegex(bagKeywords), ...anyFieldRegex(sunglassesKeywords)] },
      ],
    };
  }

  if (id === "cordset") {
    return {
      $and: [
        { $or: anyFieldRegex(cordsetKeywords) },
        { $nor: [...anyFieldRegex(watchKeywords), ...anyFieldRegex(shoeKeywords), ...anyFieldRegex(sandalKeywords), ...anyFieldRegex(perfumeKeywords), ...anyFieldRegex(bagKeywords), ...anyFieldRegex(sunglassesKeywords)] },
      ],
    };
  }

  return {};
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
    const projection = isCompactResponse(req)
      ? {
          name: 1,
          price: 1,
          mrp: 1,
          originalPrice: 1,
          images: 1,
          image: 1,
          slug: 1,
          productUrl: 1,
          category: 1,
          brandName: 1,
          brand_name: 1,
          sizes: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      : null;

    let query = Product.find(filter, projection).sort(sortSpec).allowDiskUse(true).skip(skip);
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

  const safetyFilter = buildCategorySafetyFilter(categoryMeta.id);

  return fetchProducts(req, res, {
    $and: [{ category: { $in: categoryMeta.sourceCategories } }, safetyFilter],
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

