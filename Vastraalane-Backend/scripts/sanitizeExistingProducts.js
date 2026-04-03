/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

const GENERIC_BY_CATEGORY = {
  "Shirts & Tshirt": "Premium Shirt",
  Loafers: "Luxury Loafer",
  Shoes: "Premium Shoes",
  "Luxury Watch": "Luxury Watch",
  "Jeans & Trouser & Trackpant": "Premium Bottomwear",
  "HandBags and Bag": "Premium Bag",
  Perfumes: "Signature Perfume",
  Sunglasses: "Premium Eyewear",
  "Cordset & Tracksuit": "Premium Tracksuit",
  "Girls Sandals and jutti": "Luxury Sandals",
  Other: "Premium Product",
};

const BRAND_PATTERNS = [
  /role\s*[_x.\-\s]*x|rolex/gi,
  /omega|omeg\s*a/gi,
  /patek\s*philippe|patek/gi,
  /audemars\s*piguet|audemars|piguet/gi,
  /hublot|hublo\s*t/gi,
  /panerai/gi,
  /rado|rad\s*o/gi,
  /seiko/gi,
  /tissot|tisso\s*t/gi,
  /fossil|fossi\s*l/gi,
  /emporio\s*armani|emporio/gi,
  /armani\s*exchange|armani|arman\s*i/gi,
  /tommy\s*hilfiger|tommy|hilfiger/gi,
  /versace/gi,
  /cavalli|roberto\s*cavalli/gi,
  /gucc\s*[\W_]*i|gucci/gi,
  /burberr\s*y|burberry/gi,
  /coach|coac\s*h/gi,
  /louis\s*vuitton|louiss?\s*vittonn?|lv/gi,
  /michael\s*kors|micheal\s*kors|mk\b/gi,
  /fendi/gi,
  /chloe/gi,
  /prada|pradaa/gi,
  /balenciaga|balencia\s*g/gi,
  /alexander\s*mcqueen|mcqueen/gi,
  /nike|nik\s*e|nikee/gi,
  /air\s*force|airforce/gi,
  /air\s*jordan|jordan/gi,
  /adidas|adida\s*s/gi,
  /yeezy/gi,
  /new\s*balance|newbalance/gi,
  /on\s*cloud|on\s*running|cloudvista|cloudtilt/gi,
  /puma|pumaa/gi,
  /hoka/gi,
  /onitsuka|tiger/gi,
  /lacoste|lacost\s*e/gi,
  /loro\s*piana|loro\s*piano/gi,
  /ralp\s*h\s*lauren|ralph\s*lauren/gi,
  /christian\s*dior|dior/gi,
  /dolce\s*&?\s*gabbana|dolce|gabbana/gi,
  /diesel|diese\s*l/gi,
  /balmain|balmai\s*n/gi,
  /boss/gi,
  /zara/gi,
  /hood\s*rich/gi,
  /cartier/gi,
  /ray\s*ban|rayban/gi,
  /oakley/gi,
  /marc\s*jacobs/gi,
  /calvin\s*klein|calvin/gi,
  /mont\s*blanc/gi,
  /david\s*beckham|beckham/gi,
  /jacques\s*marie\s*mage|jacques/gi,
  /loewe/gi,
  /suocchi/gi,
  /diptyque/gi,
  /acqua\s*di\s*gio|acqua|gio/gi,
  /tom\s*ford|tomford/gi,
  /valentino/gi,
  /giorgio/gi,
  /azzaro/gi,
  /bvlgari/gi,
  /carolina\s*herrera|carolina|herrera/gi,
  /givenchy/gi,
  /paco\s*rabanne|paco|rabanne/gi,
  /yves\s*saint\s*laurent|ysl|yves/gi,
  /victoria\s*secret|victoria|secret/gi,
  /maison\s*margiela|margiela/gi,
  /narciso/gi,
  /twilly/gi,
  /police/gi,
  /birkenstock/gi,
  /crocs/gi,
  /oyster/gi,
  /ophidia/gi,
];

const PRODUCT_TYPE_NORMALIZATION = [
  { pattern: /\bwatch(es)?\b/gi, replacement: "Watch" },
  { pattern: /\bperfumes?\b/gi, replacement: "Perfume" },
  { pattern: /\bfragrances?\b/gi, replacement: "Perfume" },
  { pattern: /\bsunglasses?\b/gi, replacement: "Eyewear" },
  { pattern: /\bloafer(rs)?\b/gi, replacement: "Loafer" },
  { pattern: /\bshoes?\b/gi, replacement: "Shoes" },
  { pattern: /\bsneakers?\b/gi, replacement: "Shoes" },
  { pattern: /\btrainers?\b/gi, replacement: "Shoes" },
  { pattern: /\bhandbags?\b/gi, replacement: "Bag" },
  { pattern: /\bbags?\b/gi, replacement: "Bag" },
  { pattern: /\btotes?\b/gi, replacement: "Bag" },
  { pattern: /\bshirts?\b/gi, replacement: "Shirt" },
  { pattern: /\bt-?\s*shirts?\b/gi, replacement: "Shirt" },
  { pattern: /\btrack\s*suits?\b/gi, replacement: "Tracksuit" },
  { pattern: /\bcord\s*sets?\b/gi, replacement: "Tracksuit" },
  { pattern: /\bjeans?\b/gi, replacement: "Bottomwear" },
  { pattern: /\btrousers?\b/gi, replacement: "Bottomwear" },
  { pattern: /\btrackpants?\b/gi, replacement: "Bottomwear" },
  { pattern: /\bsandals?\b/gi, replacement: "Sandals" },
  { pattern: /\bjutti\b/gi, replacement: "Sandals" },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collapseWords(name) {
  const words = name.split(" ").filter(Boolean);
  const result = [];

  for (const word of words) {
    const normalized = word.toLowerCase();
    if (result.length > 0 && result[result.length - 1].toLowerCase() === normalized) {
      continue;
    }
    result.push(word);
  }

  return result.join(" ");
}

function sanitizeBrandName(productName, category) {
  if (!productName) return productName;

  let name = String(productName);
  const genericBase = GENERIC_BY_CATEGORY[category] || GENERIC_BY_CATEGORY.Other;

  for (const pattern of BRAND_PATTERNS) {
    name = name.replace(pattern, genericBase);
  }

  for (const { pattern, replacement } of PRODUCT_TYPE_NORMALIZATION) {
    name = name.replace(pattern, replacement);
  }

  name = name.replace(/\b(with|and|for|of|by|edition|limited|imported|premium|luxury|exclusive|signature|classic|cool|exotic)\b/gi, (match) => {
    const allowed = ["premium", "luxury", "exclusive", "signature", "classic", "cool", "exotic"];
    return allowed.includes(match.toLowerCase()) ? match : " ";
  });

  const baseEscaped = escapeRegex(genericBase);
  name = name.replace(new RegExp(`(?:${baseEscaped}\\s+)+`, "gi"), `${genericBase} `);
  name = name.replace(/\b(gg|cb|lv|mk|og)\b/gi, " ");
  name = name.replace(/[_.\-\/]+/g, " ");
  name = name.replace(/\s+/g, " ").trim();
  name = collapseWords(name);

  if (!name || name.length < 4) {
    return genericBase;
  }

  if (!new RegExp(baseEscaped, "i").test(name)) {
    name = `${genericBase} ${name}`.trim();
  }

  name = name.replace(/\s+/g, " ").trim();
  return collapseWords(name);
}

async function sanitizeAllProducts() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  const allProducts = await Product.find({}, { name: 1, category: 1 });
  console.log(`Found ${allProducts.length} products to process`);

  const BATCH_SIZE = 1000;
  let updated = 0;
  let noChange = 0;

  for (let start = 0; start < allProducts.length; start += BATCH_SIZE) {
    const batch = allProducts.slice(start, start + BATCH_SIZE);
    const ops = [];

    for (const product of batch) {
      const originalName = product.name;
      const sanitizedName = sanitizeBrandName(originalName, product.category);

      if (originalName !== sanitizedName) {
        ops.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { name: sanitizedName } },
          },
        });
        updated += 1;
      } else {
        noChange += 1;
      }
    }

    if (ops.length > 0) {
      await Product.bulkWrite(ops, { ordered: false });
    }

    console.log(`Processed ${Math.min(start + batch.length, allProducts.length)}/${allProducts.length}`);
  }

  console.log("\nSanitization complete");
  console.log(`Updated: ${updated}`);
  console.log(`No changes needed: ${noChange}`);
  console.log(`Total processed: ${allProducts.length}`);
}

sanitizeAllProducts()
  .catch((err) => {
    console.error("Sanitization failed:", err?.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    } catch {
      // ignore
    }
  });
