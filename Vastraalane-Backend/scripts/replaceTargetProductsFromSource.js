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

    const sourceCount = await SourceProduct.countDocuments();
    const targetBefore = await TargetProduct.countDocuments();

    console.log(`[replace-products] source count=${sourceCount}`);
    console.log(`[replace-products] target count before=${targetBefore}`);

    const deleteResult = await TargetProduct.deleteMany({});
    console.log(`[replace-products] deleted from target=${deleteResult.deletedCount || 0}`);

    const BATCH_SIZE = 500;
    let copied = 0;

    for (let skip = 0; skip < sourceCount; skip += BATCH_SIZE) {
      const batch = await SourceProduct.find({})
        .sort({ _id: 1 })
        .skip(skip)
        .limit(BATCH_SIZE)
        .lean();

      if (!batch.length) continue;

      await TargetProduct.insertMany(batch.map(sanitizeProductDocument), { ordered: false });
      copied += batch.length;
      console.log(`[replace-products] inserted=${copied}/${sourceCount}`);
    }

    const targetAfter = await TargetProduct.countDocuments();
    console.log(`[replace-products] complete target count after=${targetAfter}`);
  } finally {
    await sourceConnection.close();
    await targetConnection.close();
  }
}

main().catch((error) => {
  console.error("[replace-products] failed:", error);
  process.exit(1);
});
