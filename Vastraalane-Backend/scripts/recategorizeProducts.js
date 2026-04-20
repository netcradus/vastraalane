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
  return [product.name, product.productUrl, product.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function detectCategory(product) {
  const text = textFor(product);
  const hasFootwearKeywords =
    /\b(shoe|shoes|sneaker|sneakers|trainer|running|air force|airforce|yeezy|jordan|dunk|gazelle|samba|new balance|balenciaga|mcqueen|on cloud|onitsuka|slip-on|slip on|puma|adidas|nike|louis vuitton trainer|lv trainer|birkenstock|superfly|cloudtilt|cloudvista|hoka|hoka[a-z]*|bondi|clifton|mafate|transport|hopara|stinson|challenger|rocket x|rocketx|mach x|machx|ora primo|cielo|kawana|rincon|speedgoat|loafer|moccasin|driving shoe|boat shoe|loro piana|boots?)\b|adid[\W_]*as|nik[\W_]*e|pum[\W_]*a/i.test(
      text
    );
  const hasSandalKeywords =
    /\b(sandal|sandals|jutti|heel|heels|slipper|sleepers|sliders|slider|slide|slides|flip flop|flipflop|crocs|chappal|kolhapuri|mule|mules)\b/i.test(
      text
    );
  const hasBagKeywords =
    /\b(handbag|tote|wallet|backpack|crossbody|cross body|cross-body|sling bag|shoulder bag|duffle|duffel|pouch|satchel|hobo|clutch|luggage|travel bag|top handle|mini ?bag|belt bag|bagpack|\bbag\b|purse|messenger bag|camera bag|boston bag|keepall|speedy|neverfull)\b/i.test(
      text
    );
  const hasCarryBagOnlyContext =
    /(carry bag|dust bag|with bag|with og bag)/i.test(text) &&
    !/(handbag|sling bag|shoulder bag|crossbody|tote|wallet|backpack|satchel|clutch|purse|messenger bag|camera bag|boston bag|keepall|speedy|neverfull)/i.test(
      text
    );

  if (
    /\b(sunglass|sunglasses|wayfarer|aviator|eyewear|goggle|frames?)\b/i.test(text)
  ) {
    return STORE_CATEGORIES.sunglasses;
  }

  if (
    /\b(loafer|loafers|moccasin|moccasins|driving shoe|boat shoe|loro piana)\b/i.test(text) &&
    !/\b(heel|heels|pump|pumps|sandal|sandals|slide|slides|slipper|sleepers|mule|mules|jutti|flip flop|flipflop|crocs|chappal)\b/i.test(
      text
    )
  ) {
    return STORE_CATEGORIES.loafers;
  }

  if (
    /(track suit|tracksuit|cordset|cord set|co-ord|co ord|coord set|two piece set|matching set)/i.test(text)
  ) {
    return STORE_CATEGORIES.tracksuit;
  }

  // Keep bag-like products out of perfume/watch categories.
  if (hasBagKeywords && !hasFootwearKeywords && !hasSandalKeywords && !hasCarryBagOnlyContext) {
    return STORE_CATEGORIES.bags;
  }

  if (
    hasSandalKeywords &&
    !/\b(sneaker|sneakers|trainer|running|boots?|loafer|moccasin|driving shoe|boat shoe|t-?shirt|tshirt|polo|hoodie|sweatshirt|jersey)\b/i.test(
      text
    )
  ) {
    return STORE_CATEGORIES.sandals;
  }

  if (
    !hasSandalKeywords &&
    /\b(shoe|shoes|sneaker|sneakers|trainer|running|air force|airforce|yeezy|jordan|dunk|gazelle|samba|new balance|balenciaga|mcqueen|on cloud|onitsuka|slip-on|slip on|puma|adidas|nike|louis vuitton trainer|lv trainer|birkenstock|superfly|cloudtilt|cloudvista|hoka|hoka[a-z]*|bondi|clifton|mafate|transport|hopara|stinson|challenger|rocket x|rocketx|mach x|machx|ora primo|cielo|kawana|rincon|speedgoat|boots?)\b/i.test(
      text
    )
  ) {
    return STORE_CATEGORIES.shoes;
  }

  if (
    /\b(gaultier|le male|le beau|classique|paradise garden)\b/i.test(text)
  ) {
    return STORE_CATEGORIES.perfumes;
  }

  if (
    /\b(perfume|parfum|fragrance|edt|edp|deodorant|body spray|gift set|cologne|pour homme|pour femme|tester|sandalwood|acqua[\s-]*di[\s-]*gio|because[\s-]*its[\s-]*you|in[\s-]*love[\s-]*with[\s-]*you|stronger[\s-]*with[\s-]*you|si[\s-]*passione|code[\s-]*black[\s-]*eau)\b/i.test(
      text
    )
  ) {
    return STORE_CATEGORIES.perfumes;
  }

  if (
    /\b(watch|chronograph|automatic|quartz|stainless[- ]steel|oyster|daytona|rolex|g-shock|casio|tissot|fossil|armani exchange|emporio armani|tag heuer|hublot|curren|naviforce|guess|audemars|piguet|patek|cartier|cartie|maserati|richard mille|rm-|ap\b|speedmaster|moonwatch|seamaster|datejust|nautilus)\b/i.test(text)
  ) {
    return STORE_CATEGORIES.watch;
  }

  if (
    /\b(shirt|t-shirt|tshirt|tee|polo|hoodie|sweatshirt|jersey|oversized tee|shacket)\b/i.test(text)
  ) {
    return STORE_CATEGORIES.shirts;
  }

  if (
    /(trackpant|track pant|cargo pant|jogger|trouser|pants?\b)/i.test(text)
  ) {
    return STORE_CATEGORIES.jeans;
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

