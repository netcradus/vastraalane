import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

function preview(value) {
  if (Array.isArray(value)) {
    return value.slice(0, 2).map(preview);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 8)
        .map(([key, entryValue]) => [key, preview(entryValue)])
    );
  }

  return String(value || "").slice(0, 180);
}

async function inspectModel(Model, query, projection) {
  const [total, withImages, cloudinary, samples] = await Promise.all([
    Model.countDocuments(),
    Model.countDocuments(query),
    Model.countDocuments({
      $or: [
        { image: /cloudinary\.com/ },
        { avatar: /cloudinary\.com/ },
        { "images.url": /cloudinary\.com/ },
        { images: /cloudinary\.com/ },
        { "items.image": /cloudinary\.com/ },
      ],
    }),
    Model.find(query).select(projection).limit(10).lean(),
  ]);

  return {
    model: Model.modelName,
    total,
    withImages,
    cloudinary,
    samples: samples.map((sample) => ({ _id: sample._id, ...preview(sample) })),
  };
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const results = await Promise.all([
    inspectModel(
      Product,
      { $or: [{ image: { $exists: true, $nin: ["", null] } }, { images: { $exists: true, $ne: [] } }] },
      "image images"
    ),
    inspectModel(Category, { image: { $exists: true, $nin: ["", null] } }, "image"),
    inspectModel(User, { avatar: { $exists: true, $nin: ["", null] } }, "avatar"),
    inspectModel(Order, { "items.image": { $exists: true, $nin: ["", null] } }, "items.image"),
  ]);

  const pendingProductSamples = await Product.find({
    $and: [
      { $or: [{ image: { $exists: true, $nin: ["", null] } }, { images: { $exists: true, $ne: [] } }] },
      { image: { $not: /cloudinary\.com/ } },
      { "images.url": { $not: /cloudinary\.com/ } },
    ],
  })
    .select("image images")
    .limit(10)
    .lean();

  console.log(JSON.stringify({ results, pendingProductSamples: pendingProductSamples.map(preview) }, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
