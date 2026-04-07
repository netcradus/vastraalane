const Product = require("../models/Product");

const CORRUPTED_BRAND_REGEX = /(^[^a-zA-Z0-9\s]+)|(_{2,})|((.)\3{3,})|([^a-zA-Z0-9\s]{2,})/;
const LUXURY_CATEGORY_IDS = new Set(["luxury", "handbags", "sunglasses"]);
const EXOTIC_CATEGORY_IDS = new Set(["perfumes", "cordset", "sandals"]);
const STANDARD_CATEGORY_IDS = new Set(["shirts", "jeans"]);

function normalizeBrandText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function chooseBrandLabel(product) {
  const price = Number(product?.price || 0);
  const categoryId = String(product?.categoryId || "").trim().toLowerCase();

  if (LUXURY_CATEGORY_IDS.has(categoryId) || price >= 2500) {
    return "Luxury";
  }

  if (EXOTIC_CATEGORY_IDS.has(categoryId)) {
    return "Exotic";
  }

  if (STANDARD_CATEGORY_IDS.has(categoryId) || price < 1200) {
    return "Standard";
  }

  return price < 1800 ? "Premium" : "Premium";
}

function isCorruptedBrandName(value) {
  const normalized = normalizeBrandText(value);
  if (!normalized) return true;
  return CORRUPTED_BRAND_REGEX.test(normalized);
}

async function cleanBrandNames({ batchSize = 500, logger = console } = {}) {
  const cursor = Product.find(
    {},
    { price: 1, category: 1, brandName: 1, brand_name: 1 }
  )
    .lean()
    .cursor();

  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let operations = [];

  for await (const product of cursor) {
    totalProcessed += 1;

    const nextBrand = chooseBrandLabel({
      price: product.price,
      categoryId: product.category,
    });

    const existingBrand = normalizeBrandText(product.brandName || product.brand_name);
    if (existingBrand === nextBrand && !isCorruptedBrandName(existingBrand)) {
      totalSkipped += 1;
      continue;
    }

    operations.push({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            brandName: nextBrand,
            brand_name: nextBrand,
          },
        },
      },
    });

    if (operations.length >= batchSize) {
      await Product.bulkWrite(operations, { ordered: false });
      totalUpdated += operations.length;
      logger.log(
        `[brand-cleanup] processed=${totalProcessed} updated=${totalUpdated} skipped=${totalSkipped}`
      );
      operations = [];
    }
  }

  if (operations.length) {
    await Product.bulkWrite(operations, { ordered: false });
    totalUpdated += operations.length;
  }

  const summary = {
    totalProcessed,
    totalUpdated,
    totalSkipped,
  };

  logger.log(`[brand-cleanup] complete ${JSON.stringify(summary)}`);
  return summary;
}

module.exports = {
  cleanBrandNames,
  chooseBrandLabel,
  isCorruptedBrandName,
};
