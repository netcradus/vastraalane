require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/Product");

const TARGET_URI = process.env.MONGO_URI;

const STORE_CATEGORIES = {
  shirts: "Shirts & Tshirt",
  loafers: "Loafers",
  shoes: "Shoes",
  watch: "Luxury Watch",
  jeans: "Jeans & Trouser & Trackpant",
  bags: "HandBags and Bag",
  perfumes: "Perfumes",
  sunglasses: "Sunglasses",
  tracksuit: "Cordset & Tracksuit",
  sandals: "Girls Sandals and jutti",
  other: "Other",
};

function textFor(product) {
  return [product.name, product.productUrl, product.slug, product.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function detectCategory(product) {
  const text = textFor(product);

  if (
    /(sunglass|wayfarer|aviator|eyewear|goggle)/i.test(text)
  ) {
    return STORE_CATEGORIES.sunglasses;
  }

  if (
    /(perfume|parfum|fragrance|edt|edp|deodorant|body spray|gift set|cologne|pour homme|pour femme|tester)/i.test(text)
  ) {
    return STORE_CATEGORIES.perfumes;
  }

  if (
    /(watch|oyster|daytona|rolex|g-shock|casio|tissot|fossil|armani exchange|emporio armani|tag heuer|hublot|curren|naviforce)/i.test(text)
  ) {
    return STORE_CATEGORIES.watch;
  }

  if (
    /(bag|handbag|tote|wallet|backpack|crossbody|sling bag|shoulder bag|duffle|duffel|pouch|satchel|hobo|clutch|luggage|travel bag)/i.test(text)
  ) {
    return STORE_CATEGORIES.bags;
  }

  if (
    /(loafer|moccasin|driving shoe|boat shoe|loro piana)/i.test(text)
  ) {
    return STORE_CATEGORIES.loafers;
  }

  if (
    /(shirt|t-shirt|tshirt|tee|polo|hoodie|sweatshirt|jersey|oversized tee)/i.test(text)
  ) {
    return STORE_CATEGORIES.shirts;
  }

  if (
    /(jean|trouser|trackpant|track pant|cargo pant|jogger|pant\b|denim)/i.test(text)
  ) {
    return STORE_CATEGORIES.jeans;
  }

  if (
    /(track suit|tracksuit|cordset|cord set|co-ord|co ord|coord set|two piece set|matching set)/i.test(text)
  ) {
    return STORE_CATEGORIES.tracksuit;
  }

  if (
    /(sandal|jutti|heel|heels|slipper|sliders|slider|flip flop|flipflop|crocs|chappal|kolhapuri)/i.test(text)
  ) {
    return STORE_CATEGORIES.sandals;
  }

  if (
    /(shoe|shoes|sneaker|sneakers|trainer|running|air force|airforce|yeezy|jordan|dunk|gazelle|samba|new balance|balenciaga|mcqueen|on cloud|puma|adidas|nike|louis vuitton trainer|lv trainer|birkenstock)/i.test(text)
  ) {
    return STORE_CATEGORIES.shoes;
  }

  return STORE_CATEGORIES.other;
}

async function main() {
  if (!TARGET_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(TARGET_URI);

  try {
    const products = await Product.find({}, { name: 1, productUrl: 1, slug: 1, category: 1 }).lean();
    console.log(`Found ${products.length} products`);

    const BATCH_SIZE = 1000;
    let updated = 0;
    let unchanged = 0;

    for (let start = 0; start < products.length; start += BATCH_SIZE) {
      const batch = products.slice(start, start + BATCH_SIZE);
      const ops = [];

      for (const product of batch) {
        const nextCategory = detectCategory(product);
        if (product.category === nextCategory) {
          unchanged += 1;
          continue;
        }

        updated += 1;
        ops.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { category: nextCategory } },
          },
        });
      }

      if (ops.length > 0) {
        await Product.bulkWrite(ops, { ordered: false });
      }

      console.log(
        `Processed ${Math.min(start + batch.length, products.length)}/${products.length} products`
      );
    }

    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    console.log(`Updated: ${updated}`);
    console.log(`Unchanged: ${unchanged}`);
    console.log("Final category counts:");
    for (const row of counts) {
      console.log(`${row._id}: ${row.count}`);
    }
  } finally {
    await mongoose.connection.close();
  }
}

main().catch((error) => {
  console.error("Recategorization failed:", error);
  process.exit(1);
});
