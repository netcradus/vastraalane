/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");
const { buildIdentityKey } = require("../utils/productPipeline");

function uniqueStrings(values) {
  const seen = new Set();
  const result = [];

  for (const value of values || []) {
    const normalized = String(value || "").trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("[migration] MongoDB connected");

  const cursor = Product.find({}).cursor();
  const operations = [];
  let scanned = 0;
  let updated = 0;

  for await (const product of cursor) {
    scanned += 1;
    const images = uniqueStrings([
      ...(Array.isArray(product.images) ? product.images : []),
      product.image,
    ]);
    const nextIdentityKey =
      product.identityKey ||
      buildIdentityKey({
        slug: product.slug,
        productUrl: product.productUrl,
        name: product.name,
      });

    const shouldUpdate =
      product.image !== images[0] ||
      (product.images || []).length !== images.length ||
      product.identityKey !== nextIdentityKey;

    if (!shouldUpdate) continue;

    operations.push({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            images,
            image: images[0],
            identityKey: nextIdentityKey,
          },
        },
      },
    });

    if (operations.length >= 500) {
      const result = await Product.bulkWrite(operations, { ordered: false });
      updated += result.modifiedCount || 0;
      operations.length = 0;
    }
  }

  if (operations.length) {
    const result = await Product.bulkWrite(operations, { ordered: false });
    updated += result.modifiedCount || 0;
  }

  console.log(
    JSON.stringify(
      {
        scanned,
        updated,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("[migration] failed:", error?.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
      console.log("[migration] MongoDB connection closed");
    } catch {
      // ignore
    }
  });
