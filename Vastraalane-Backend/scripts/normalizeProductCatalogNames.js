import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { configureDnsForSrv } from "../utils/dns.js";
import { normalizeCatalogProductName } from "../utils/normalizeProductName.js";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  configureDnsForSrv();
  await mongoose.connect(process.env.MONGO_URI);

  let scanned = 0;
  let changed = 0;

  const cursor = Product.find({}).select("name category").cursor();

  for await (const product of cursor) {
    scanned += 1;
    const categoryName = typeof product.category === "string" ? product.category : product.category?.name || "";
    const nextName = normalizeCatalogProductName(product.name, categoryName);

    if (!nextName || nextName === product.name) {
      continue;
    }

    changed += 1;

    if (!dryRun) {
      product.name = nextName;
      await product.save();
    }
  }

  console.log(`${dryRun ? "Would update" : "Updated"} ${changed} of ${scanned} products.`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
