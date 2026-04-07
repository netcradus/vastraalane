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

function getIdentityValue(product) {
  const identityKey = String(product?.identityKey || "").trim();
  if (identityKey) return `identity:${identityKey}`;

  const productUrl = String(product?.productUrl || "").trim();
  if (productUrl) return `url:${productUrl}`;

  const slug = String(product?.slug || "").trim();
  if (slug) return `slug:${slug}`;

  const name = String(product?.name || "").trim().toLowerCase();
  if (name) return `name:${name}`;

  return null;
}

async function main() {
  const sourceConnection = await mongoose.createConnection(SOURCE_URI).asPromise();
  const targetConnection = await mongoose.createConnection(TARGET_URI).asPromise();

  try {
    const SourceProduct = sourceConnection.model("Product", Product.schema, "products");
    const TargetProduct = targetConnection.model("Product", Product.schema, "products");

    const sourceProducts = await SourceProduct.find(
      {},
      { identityKey: 1, productUrl: 1, slug: 1, name: 1 }
    ).lean();

    const sourceIdentities = new Set(
      sourceProducts.map(getIdentityValue).filter(Boolean)
    );

    const targetCountBefore = await TargetProduct.countDocuments();
    console.log(`[prune-target] source identities=${sourceIdentities.size}`);
    console.log(`[prune-target] target count before=${targetCountBefore}`);

    const BATCH_SIZE = 1000;
    let processed = 0;
    let deleted = 0;

    for await (const product of TargetProduct.find(
      {},
      { identityKey: 1, productUrl: 1, slug: 1, name: 1 }
    ).cursor()) {
      processed += 1;
      const identity = getIdentityValue(product);

      if (!identity || !sourceIdentities.has(identity)) {
        await TargetProduct.deleteOne({ _id: product._id });
        deleted += 1;
      }

      if (processed % BATCH_SIZE === 0) {
        console.log(`[prune-target] processed=${processed} deleted=${deleted}`);
      }
    }

    const targetCountAfter = await TargetProduct.countDocuments();
    console.log(`[prune-target] complete deleted=${deleted} target count after=${targetCountAfter}`);
  } finally {
    await sourceConnection.close();
    await targetConnection.close();
  }
}

main().catch((error) => {
  console.error("[prune-target] failed:", error);
  process.exit(1);
});
