/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const { cleanBrandNames } = require("../utils/brandCleanup");

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("[brand-cleanup] MongoDB connected");

  await cleanBrandNames({
    batchSize: Math.min(Math.max(Number(process.env.BRAND_BATCH_SIZE || 500), 50), 2000),
    logger: console,
  });
}

main()
  .catch((error) => {
    console.error("[brand-cleanup] failed:", error?.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
      console.log("[brand-cleanup] MongoDB connection closed");
    } catch {
      // ignore
    }
  });
