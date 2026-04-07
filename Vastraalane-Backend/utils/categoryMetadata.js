const CATEGORY_META = {
  shirts: {
    id: "shirts",
    name: "Shirts & T-Shirts",
    sourceCategories: ["Shirts & Tshirt", "Shirts", "T-Shirts"],
    label: "Shirts & T-Shirts",
  },
  loafers: {
    id: "loafers",
    name: "Loafers",
    sourceCategories: ["Loafers", "loafers"],
    label: "Loafers",
  },
  shoes: {
    id: "shoes",
    name: "Shoes",
    sourceCategories: ["Shoes", "Men's Shoe", "Women's Shoes", "Premium Shoes"],
    label: "Shoes",
  },
  luxury: {
    id: "luxury",
    name: "Luxury Watch",
    sourceCategories: ["Luxury Watch", "Mens Watch", "Ladies Watch"],
    label: "Luxury Watch",
  },
  jeans: {
    id: "jeans",
    name: "Jeans, Trousers & Trackpants",
    sourceCategories: ["Jeans & Trouser & Trackpant", "Jeans", "Track Pants"],
    label: "Jeans, Trousers & Trackpants",
  },
  handbags: {
    id: "handbags",
    name: "Handbags & Bags",
    sourceCategories: ["HandBags and Bag", "Hand bags", "Bags"],
    label: "Handbags & Bags",
  },
  perfumes: {
    id: "perfumes",
    name: "Perfumes",
    sourceCategories: ["Perfumes", "Perfume For Men", "Perfume For Women", "Fragrance Gift Set"],
    label: "Perfumes",
  },
  sunglasses: {
    id: "sunglasses",
    name: "Sunglasses",
    sourceCategories: [
      "Sunglasses",
      "Sunglasses and Frames",
      "Premium sunglass",
      "Ladies Sunglasses",
      "Frames",
    ],
    label: "Sunglasses",
  },
  cordset: {
    id: "cordset",
    name: "Cordset & Tracksuit",
    sourceCategories: ["Cordset & Tracksuit", "Premium Track Suits"],
    label: "Cordset & Tracksuit",
  },
  sandals: {
    id: "sandals",
    name: "Sandals & Jutti",
    sourceCategories: ["Girls Sandals and jutti", "Sandals/Chappal"],
    label: "Sandals & Jutti",
  },
};

function getCategoryMetaById(categoryId) {
  const normalized = String(categoryId || "").trim().toLowerCase();
  return CATEGORY_META[normalized] || null;
}

function getCategoryMetaBySourceName(categoryName) {
  const normalized = String(categoryName || "").trim().toLowerCase();
  return (
    Object.values(CATEGORY_META).find((meta) =>
      meta.sourceCategories.some((entry) => entry.toLowerCase() === normalized)
    ) || null
  );
}

function getAllCategoryMeta() {
  return Object.values(CATEGORY_META);
}

module.exports = {
  CATEGORY_META,
  getAllCategoryMeta,
  getCategoryMetaById,
  getCategoryMetaBySourceName,
};
