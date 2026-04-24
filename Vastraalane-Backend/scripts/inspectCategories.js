import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const grouped = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  console.log("Category counts:");
  for (const item of grouped) {
    console.log(`${item.count.toString().padStart(5)}  ${item._id}  (${slugify(item._id)})`);
  }

  console.log("\nSamples by category:");
  for (const category of grouped.map((item) => item._id)) {
    const docs = await Product.find({ category })
      .select("name slug productUrl category")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    console.log(`\n${category}:`);
    for (const doc of docs) {
      console.log(`- ${doc.name || ""} | ${doc.slug || ""} | ${doc.productUrl || ""}`);
    }
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
