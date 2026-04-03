require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/Product");

const SOURCE_URI =
  process.env.SOURCE_MONGO_URI ||
  "mongodb+srv://sona2529001:29SONA01@cluster0.cyzx42e.mongodb.net/nc_crm?retryWrites=true&w=majority";
const TARGET_URI =
  process.env.TARGET_MONGO_URI ||
  process.env.MONGO_URI ||
  "mongodb+srv://netcradus_db_user:gwQGRJs7Y4WFbHda@cluster0.zcdpx8c.mongodb.net/client_vastraleena?retryWrites=true&w=majority";
const MIRROR_TARGET = String(process.env.MIRROR_TARGET).toLowerCase() === "true";

function buildFilter(product) {
  if (product.productUrl) return { productUrl: product.productUrl };
  if (product.slug) return { slug: product.slug };
  if (product.name && product.image) return { name: product.name, image: product.image };
  return { name: product.name };
}

async function main() {
  const sourceConnection = await mongoose.createConnection(SOURCE_URI).asPromise();
  const targetConnection = await mongoose.createConnection(TARGET_URI).asPromise();

  const SourceProduct = sourceConnection.model("Product", Product.schema, "products");
  const TargetProduct = targetConnection.model("Product", Product.schema, "products");

  try {
    const sourceProducts = await SourceProduct.find({}).lean();

    if (sourceProducts.length === 0) {
      console.log("No products found in source database.");
      return;
    }

    if (MIRROR_TARGET) {
      await TargetProduct.collection.deleteMany({});

      const BATCH_SIZE = 1000;
      let inserted = 0;

      for (let start = 0; start < sourceProducts.length; start += BATCH_SIZE) {
        const batch = sourceProducts
          .slice(start, start + BATCH_SIZE)
          .map(({ _id, ...product }) => product);
        const result = await TargetProduct.insertMany(batch, { ordered: false });
        inserted += result.length;
      }

      const targetCount = await TargetProduct.countDocuments();
      console.log(`Source products: ${sourceProducts.length}`);
      console.log(`Mirror mode: target collection replaced`);
      console.log(`Inserted: ${inserted}`);
      console.log(`Target products after copy: ${targetCount}`);
      return;
    }

    const ops = sourceProducts.map(({ _id, ...product }) => ({
      replaceOne: {
        filter: buildFilter(product),
        replacement: product,
        upsert: true,
      },
    }));

    const result = await TargetProduct.bulkWrite(ops, { ordered: false });
    const targetCount = await TargetProduct.countDocuments();

    console.log(`Source products: ${sourceProducts.length}`);
    console.log(`Inserted: ${result.upsertedCount || 0}`);
    console.log(`Matched: ${result.matchedCount || 0}`);
    console.log(`Modified: ${result.modifiedCount || 0}`);
    console.log(`Target products after copy: ${targetCount}`);
  } finally {
    await sourceConnection.close();
    await targetConnection.close();
  }
}

main().catch((error) => {
  console.error("Product copy failed:", error);
  process.exit(1);
});
