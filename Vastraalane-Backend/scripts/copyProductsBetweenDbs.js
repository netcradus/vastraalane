/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("../models/Product");

const SOURCE_URI =
  process.env.SOURCE_MONGO_URI ||
  "mongodb+srv://sona2529001:29SONA01@cluster0.cyzx42e.mongodb.net/vastraalane?retryWrites=true&w=majority";

const TARGET_URI =
  process.env.TARGET_MONGO_URI ||
  "mongodb+srv://netcradus_db_user:gwQGRJs7Y4WFbHda@cluster0.zcdpx8c.mongodb.net/client_vastraleena?retryWrites=true&w=majority";

function buildIdentityFilter(product) {
  const identityKey = String(product.identityKey || "").trim();
  const productUrl = String(product.productUrl || "").trim();
  const slug = String(product.slug || "").trim();
  const name = String(product.name || "").trim();

  if (identityKey) return { identityKey };
  if (productUrl) return { productUrl };
  if (slug) return { slug };
  return { name };
}

function sanitizeProductDocument(product) {
  const doc = { ...product };
  delete doc._id;
  delete doc.__v;
  return doc;
}

async function main() {
  const sourceConnection = await mongoose.createConnection(SOURCE_URI).asPromise();
  const targetConnection = await mongoose.createConnection(TARGET_URI).asPromise();

  try {
    const SourceProduct = sourceConnection.model("Product", Product.schema, "products");
    const TargetProduct = targetConnection.model("Product", Product.schema, "products");

    const totalProducts = await SourceProduct.countDocuments();
    console.log(`[copy-products] source count=${totalProducts}`);

    const BATCH_SIZE = 500;
    let copied = 0;
    let insertedOrUpdated = 0;

    for (let skip = 0; skip < totalProducts; skip += BATCH_SIZE) {
      const batch = await SourceProduct.find({})
        .sort({ _id: 1 })
        .skip(skip)
        .limit(BATCH_SIZE)
        .lean();

      if (!batch.length) continue;

      const ops = batch.map((product) => ({
        updateOne: {
          filter: buildIdentityFilter(product),
          update: { $set: sanitizeProductDocument(product) },
          upsert: true,
        },
      }));

      const result = await TargetProduct.bulkWrite(ops, { ordered: false });

      copied += batch.length;
      insertedOrUpdated +=
        Number(result.upsertedCount || 0) +
        Number(result.modifiedCount || 0) +
        Number(result.matchedCount || 0);

      console.log(
        `[copy-products] processed=${copied}/${totalProducts} upserted=${result.upsertedCount || 0} modified=${result.modifiedCount || 0} matched=${result.matchedCount || 0}`
      );
    }

    const targetCount = await TargetProduct.countDocuments();
    console.log(
      `[copy-products] complete source=${totalProducts} target=${targetCount} touched=${insertedOrUpdated}`
    );
  } finally {
    await sourceConnection.close();
    await targetConnection.close();
  }
}

main().catch((error) => {
  console.error("[copy-products] failed:", error);
  process.exit(1);
});
