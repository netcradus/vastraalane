import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { inferProductCategory } from "../utils/categorizeProduct.js";
import { configureDnsForSrv } from "../utils/dns.js";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  configureDnsForSrv();
  await mongoose.connect(process.env.MONGO_URI);

  const summary = new Map();
  let scanned = 0;
  let changed = 0;

  const cursor = Product.find({}).select("name slug productUrl description brand tags category").cursor();

  for await (const product of cursor) {
    scanned += 1;

    const nextCategory = inferProductCategory(product);
    const currentCategory = String(product.category || "");

    if (nextCategory === currentCategory || (nextCategory === "Other" && currentCategory)) {
      continue;
    }

    changed += 1;
    const key = `${currentCategory || "(empty)"} -> ${nextCategory}`;
    summary.set(key, (summary.get(key) || 0) + 1);

    if (!dryRun) {
      product.category = nextCategory;
      await product.save();
    }
  }

  console.log(`${dryRun ? "Dry run" : "Updated"} ${changed} of ${scanned} products.`);
  console.log("\nChanges by category:");
  for (const [key, count] of [...summary.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`${count.toString().padStart(5)}  ${key}`);
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
