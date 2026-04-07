/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("[reset] MongoDB connected");

  const result = await Product.deleteMany({});
  console.log(
    JSON.stringify(
      {
        deletedProducts: result.deletedCount || 0,
      },
      null,
      2
    )
  );

  await Product.syncIndexes();
  console.log("[reset] Product indexes synced");
}

main()
  .catch((error) => {
    console.error("[reset] failed:", error?.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
      console.log("[reset] MongoDB connection closed");
    } catch {
      // ignore
    }
  });
