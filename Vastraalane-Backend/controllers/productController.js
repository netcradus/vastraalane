const Product = require("../models/Product");

function toInt(v, fallback) {
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : fallback;
}

// GET /api/products?page=1&limit=24&search=&minPrice=&maxPrice=&sort=
exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const wantsAll =
      String(req.query.all || "").toLowerCase() === "true" ||
      String(req.query.limit || "").toLowerCase() === "all";
    const limit = wantsAll
      ? null
      : Math.min(100, Math.max(1, toInt(req.query.limit, 24)));

    const search = (req.query.search || "").toString().trim();
    const category = (req.query.category || "").toString().trim();
    const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;
    const sort = (req.query.sort || "featured").toString();

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      filter.price = {};
      if (Number.isFinite(minPrice)) filter.price.$gte = minPrice;
      if (Number.isFinite(maxPrice)) filter.price.$lte = maxPrice;
    }

    let sortSpec = { createdAt: -1 };
    if (sort === "low-high") sortSpec = { price: 1, createdAt: -1 };
    if (sort === "high-low") sortSpec = { price: -1, createdAt: -1 };

    const skip = wantsAll ? 0 : (page - 1) * limit;

    const totalItems = await Product.countDocuments(filter);

    let query = Product.find(filter).sort(sortSpec).skip(skip);
    if (!wantsAll && limit !== null) {
      query = query.limit(limit);
    }

    const products = await query.lean();

    const totalPages = wantsAll ? 1 : Math.max(1, Math.ceil(totalItems / limit));

    res.json({
      products,
      page,
      limit: wantsAll ? totalItems : limit,
      totalItems,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getCategoryCounts = async (_req, res) => {
  try {
    const counts = await Product.aggregate([
      { $match: { category: { $exists: true, $ne: null, $ne: "" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    res.json({ categories: counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch category counts" });
  }
};
