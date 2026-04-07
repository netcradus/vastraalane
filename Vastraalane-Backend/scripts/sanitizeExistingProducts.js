/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

const TYPE_BY_CATEGORY = {
  "Shirts & Tshirt": "Shirt",
  Shirts: "Shirt",
  "T-Shirts": "Shirt",
  Loafers: "Loafers",
  Shoes: "Shoes",
  "Men's Shoe": "Shoes",
  "Women's Shoes": "Shoes",
  "Premium Shoes": "Shoes",
  "Luxury Watch": "Watch",
  "Mens Watch": "Watch",
  "Ladies Watch": "Watch",
  "Jeans & Trouser & Trackpant": "Bottomwear",
  Jeans: "Jeans",
  "Track Pants": "Trackpants",
  "HandBags and Bag": "Bag",
  "Hand bags": "Bag",
  Bags: "Bag",
  Perfumes: "Perfume",
  "Perfume For Men": "Perfume",
  "Perfume For Women": "Perfume",
  "Fragrance Gift Set": "Perfume",
  Sunglasses: "Sunglasses",
  "Sunglasses and Frames": "Sunglasses",
  "Premium sunglass": "Sunglasses",
  "Ladies Sunglasses": "Sunglasses",
  Frames: "Sunglasses",
  "Cordset & Tracksuit": "Tracksuit",
  "Premium Track Suits": "Tracksuit",
  "Girls Sandals and jutti": "Sandals",
  "Sandals/Chappal": "Sandals",
  Other: "Product",
};

const BRAND_PATTERNS = [
  /loui+\s*s?\s*vuit+t*o*n*n*|louiss?\s*vuittonn?|louis\s*vuitto\s*n|louis\s*vuiton|louis\s*vuittion|louis\s*vuitton|lv\b/gi,
  /gucc+\s*[\W_]*i|gucci/gi,
  /ralp+\s*h?\s*lauren|ralph\s*lauren/gi,
  /adida+a+s+|adida\s*a+\s*s+|adidas/gi,
  /nik+k*e+e*|nik\s*e|nike/gi,
  /burber+r*y|burberry/gi,
  /arman+i|armani/gi,
  /fossi+l|fossil/gi,
  /prad+a|prada/gi,
  /vuitto\s*n|vuittton|vuttion|vuittonn|vuitton|vuitto n/gi,
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
  /burberr\s*y|burberry/gi,
  /coach|coac\s*h/gi,
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
  /yzy/gi,
  /neverfull/gi,
  /capucines/gi,
  /pochette/gi,
  /apogee/gi,
  /discovery/gi,
  /california\s*dream/gi,
  /charlie/gi,
  /monogram/gi,
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

const BANNED_TOKENS = new Set([
  "adidaaass", "adidaass", "adidas", "adida", "yeezy", "yzy",
  "nike", "nikkee", "nikke", "nik", "jordan",
  "louis", "loui", "louiss", "louiis", "vuitton", "vuiton", "vuitto", "vuittton", "vuttion", "vuittion",
  "gucci", "gucc", "ralph", "lauren", "rolex", "rolexx", "rolexx", "rolexxx", "rolexxxx", "rolexxxxxx",
  "role", "oyster", "prada", "armani", "emporio", "burberry", "burberr", "coach", "fossil", "cartier",
  "oakley", "rayban", "ray", "ban", "versace", "balenciaga", "mcqueen", "loewe", "fendi", "dior",
  "dolce", "gabbana", "tommy", "hilfiger", "lacoste", "loro", "piana", "michael", "kors", "mk",
  "azzaro", "valentino", "bvlgari", "givenchy", "paco", "rabanne", "ysl", "victoria", "secret",
  "diptyque", "apogee", "neverfull", "capucines", "pochette", "ophidia", "charlie", "monogram"
]);

const NOISE_TOKENS = new Set([
  "box", "packing", "dustbag", "dust", "cover", "dustcover", "carrybag", "carry", "bill", "slingbelt",
  "sling", "doublebox", "combo", "plain", "accessories", "accessory", "fixed", "sale", "premiumquality",
  "quality", "made", "italy", "italian", "brand", "logo", "logos", "emborssed", "embossed", "printed",
  "imported", "original", "og", "ua", "all", "kit"
]);

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

function normalizeToken(token) {
  return token.toLowerCase().replace(/[^a-z]/g, "");
}

function stripBannedFragments(name) {
  const parts = name.split(/\s+/).filter(Boolean);
  const kept = [];

  for (const part of parts) {
    const normalized = normalizeToken(part);
    if (!normalized) continue;
    if (BANNED_TOKENS.has(normalized)) continue;
    if (NOISE_TOKENS.has(normalized)) continue;
    kept.push(part);
  }

  return kept.join(" ");
}

function extractDescriptor(productName) {
  const text = String(productName || "").toLowerCase();
  const descriptors = [];
  const options = [
    "black", "white", "blue", "navy", "green", "grey", "gray", "brown", "beige",
    "pink", "red", "gold", "silver", "cream", "olive", "yellow", "purple",
    "maroon", "orange", "tan", "coffee", "mono", "bicolor", "floral", "classic",
    "signature", "sport", "retro", "vintage", "modern", "elegant", "daily",
    "rose", "tiffany"
  ];

  for (const option of options) {
    if (text.includes(option)) {
      descriptors.push(option.charAt(0).toUpperCase() + option.slice(1));
    }
    if (descriptors.length === 2) break;
  }

  return descriptors.join(" ");
}

function inferProductType(product) {
  const categoryType = TYPE_BY_CATEGORY[product?.category] || TYPE_BY_CATEGORY.Other;
  const text = String(product?.name || "").toLowerCase();

  if (categoryType !== "Product") return categoryType;
  if (/(shoe|sneaker|airforce|air force|jordan|yeezy|trainer|loafer)/i.test(text)) return "Shoes";
  if (/(bag|tote|crossbody|wallet|pouch|sling)/i.test(text)) return "Bag";
  if (/(watch|rolex|armani|fossil|curren)/i.test(text)) return "Watch";
  if (/(shirt|t-shirt|tee|polo)/i.test(text)) return "Shirt";
  if (/(perfume|fragrance|parfum)/i.test(text)) return "Perfume";
  if (/(sunglass|eyewear|frame)/i.test(text)) return "Sunglasses";
  if (/(tracksuit|cordset|track suit)/i.test(text)) return "Tracksuit";
  if (/(sandals|jutti|slipper|chappal|crocs)/i.test(text)) return "Sandals";
  return "Product";
}

function buildCleanName(product) {
  const brandLabel = String(product?.brandName || product?.brand_name || "Premium").trim() || "Premium";
  const descriptor = extractDescriptor(product?.name);
  const productType = inferProductType(product);

  return [brandLabel, descriptor, productType].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function sanitizeBrandName(product) {
  if (!product?.name) return product?.name;

  let name = String(product.name);
  const cleanBaseName = buildCleanName(product);

  for (const pattern of BRAND_PATTERNS) {
    name = name.replace(pattern, cleanBaseName);
  }

  for (const { pattern, replacement } of PRODUCT_TYPE_NORMALIZATION) {
    name = name.replace(pattern, replacement);
  }

  name = name.replace(/\b(box|packing|dustbag|dust bag|dustcover|dust cover|carrybag|carry bag|bill|slingbelt|sling belt|doublebox|double box|combo box|plain box|all accessories|accessories|fixed|sale)\b/gi, " ");

  name = name.replace(/\b(with|and|for|of|by|edition|limited|imported|premium|luxury|exclusive|signature|classic|cool|exotic)\b/gi, (match) => {
    const allowed = ["premium", "luxury", "exclusive", "signature", "classic", "cool", "exotic"];
    return allowed.includes(match.toLowerCase()) ? match : " ";
  });

  const baseEscaped = escapeRegex(cleanBaseName);
  name = name.replace(new RegExp(`(?:${baseEscaped}\\s+)+`, "gi"), `${cleanBaseName} `);
  name = name.replace(/\b(gg|cb|lv|mk|og)\b/gi, " ");
  name = name.replace(/[_.\-\/]+/g, " ");
  name = name.replace(/\b[a-z]\b/gi, " ");
  name = stripBannedFragments(name);
  name = name.replace(/\s+/g, " ").trim();
  name = collapseWords(name);

  if (!name || name.length < 4) {
    return cleanBaseName;
  }

  if (!new RegExp(escapeRegex(cleanBaseName), "i").test(name)) {
    return cleanBaseName;
  }

  return cleanBaseName;
}

async function sanitizeAllProducts() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  const allProducts = await Product.find({}, { name: 1, category: 1, brandName: 1, brand_name: 1 });
  console.log(`Found ${allProducts.length} products to process`);

  const BATCH_SIZE = 1000;
  let updated = 0;
  let noChange = 0;

  for (let start = 0; start < allProducts.length; start += BATCH_SIZE) {
    const batch = allProducts.slice(start, start + BATCH_SIZE);
    const ops = [];

    for (let offset = 0; offset < batch.length; offset += 1) {
      const product = batch[offset];
      const originalName = product.name;
      const sanitizedName = sanitizeBrandName(product);

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
