import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { configureDnsForSrv } from "../utils/dns.js";

const checks = [
  {
    category: "Girls Sandals and jutti",
    label: "shoe/sneaker/loafer/watch/bag/shirt/bottomwear/men slipper terms",
    regex: /\b(shoe|shoes|sneaker|sneakers|loafer|loafers|watch|watches|handbag|tote|shirt|tshirt|trouser|trackpant|jeans|crocs?|clog|skechers|puma|hot wheels|the north|ugg|tasman|nike calm|nk calm|literide|hyper burst)\b/i,
  },
  {
    category: "HandBags and Bag",
    label: "shoe/sandal/shirt/bottomwear/watch/perfume terms",
    regex: /\b(shoe|shoes|sneaker|sneakers|sandal|sandals|slide|slides|mule|mules|heel|heels|shirt|tshirt|trouser|trackpant|jeans|watch|watches|perfume|edp|edt)\b/i,
  },
  {
    category: "Jeans & Trouser & Trackpant",
    label: "shirt/shoe/watch/bag terms",
    regex: /\b(shirt|tshirt|shoe|shoes|sneaker|sneakers|watch|watches|handbag|tote)\b/i,
  },
  {
    category: "Luxury Watch",
    label: "shoe/sandal/shirt/bag/bottomwear terms",
    regex: /\b(shoe|shoes|sneaker|sneakers|sandal|sandals|slide|slides|mule|mules|heel|heels|shirt|tshirt|handbag|tote|trouser|trackpant|jeans)\b/i,
  },
  {
    category: "Loafers",
    label: "pump/heel/sandal terms",
    regex: /\b(pump|pumps|heel|heels|sandal|sandals|wedge|slingback)\b/i,
  },
];

function textExpr(regex) {
  return {
    $or: [
      { name: regex },
      { slug: regex },
      { productUrl: regex },
      { description: regex },
      { brand: regex },
    ],
  };
}

async function main() {
  configureDnsForSrv();
  await mongoose.connect(process.env.MONGO_URI);

  const counts = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  console.log("Category counts:");
  for (const item of counts) {
    console.log(`${item.count.toString().padStart(5)}  ${item._id}`);
  }

  console.log("\nSuspicious samples:");
  for (const check of checks) {
    const query = { category: check.category, ...textExpr(check.regex) };
    const [count, samples] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).select("name slug productUrl category").limit(10).lean(),
    ]);

    console.log(`\n${check.category} - ${check.label}: ${count}`);
    for (const sample of samples) {
      console.log(`- ${sample.name || ""} | ${sample.slug || ""} | ${sample.productUrl || ""}`);
    }
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
