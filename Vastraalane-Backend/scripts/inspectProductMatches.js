import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { configureDnsForSrv } from "../utils/dns.js";

const term = process.argv.slice(2).join(" ") || "adidas|addidas|yeezy|storm edge|slide|sleeper";
const regex = new RegExp(term, "i");

async function main() {
  configureDnsForSrv();
  await mongoose.connect(process.env.MONGO_URI);

  const docs = await Product.find({
    $or: [{ name: regex }, { slug: regex }, { productUrl: regex }, { description: regex }, { brand: regex }],
  })
    .select("name slug productUrl category")
    .limit(120)
    .lean();

  console.log(JSON.stringify(docs, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
