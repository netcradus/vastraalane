/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

// 🔧 Simple and effective brand name sanitization
function sanitizeBrandName(productName) {
  if (!productName) return productName;

  let name = String(productName);
  const original = name;

  // Use simple regex replacements for maximum clarity
  // Match brand names case-insensitively and replace with generic names
  
  // Watches (must come before generic watches)
  name = name.replace(/\b(rolex|role\s*[_x\s]x|role x)\b/gi, "Exclusive Watch");
  name = name.replace(/\b(omega|omeg\s*a)\b/gi, "Luxury Watch");
  name = name.replace(/\b(patek\s*philippe|patek)\b/gi, "Luxury Watch");
  name = name.replace(/\b(audemars|piguet)\b/gi, "Premium Watch");
  name = name.replace(/\b(hublot|hublo\s*t)\b/gi, "Premium Watch");
  name = name.replace(/\b(panerai)\b/gi, "Exclusive Watch");
  name = name.replace(/\b(rado|rad\s*_?\s*o)\b/gi, "Premium Watch");
  name = name.replace(/\b(seiko)\b/gi, "Luxury Watch");
  name = name.replace(/\b(tissot|tisso\s*t)\b/gi, "Premium Watch");
  name = name.replace(/\b(emporio)\b/gi, "Premium Watch");
  name = name.replace(/\b(armani|arman\s*i)\b/gi, "Premium Watch");
  name = name.replace(/\b(tommy|hilfiger)\b/gi, "Classic Watch");
  name = name.replace(/\b(versace)\b/gi, "Luxury Watch");
  name = name.replace(/\b(fossil)\b/gi, "Signature Watch");
  name = name.replace(/\b(cavalli)\b/gi, "Luxury Watch");

  // Handbags & Bags
  name = name.replace(/\b(gucci)\b/gi, "Premium Handbag");
  name = name.replace(/\b(burberry|burberr\s*y)\b/gi, "Premium Tote");
  name = name.replace(/\b(coach|coac\s*h)\b/gi, "Premium Bag");
  name = name.replace(/\b(louis|vuitton)\b/gi, "Luxury Bag");
  name = name.replace(/\b(michael|kors)\b/gi, "Premium Tote");
  name = name.replace(/\b(chloe)\b/gi, "Luxury Handbag");

  // Shoes & Sneakers (prioritize multi-word brands first)
  name = name.replace(/\b(air\s*jordan|jordan)\b/gi, "Premium Sneakers");
  name = name.replace(/\b(golden\s*goose|ggdb)\b/gi, "Premium Sneakers");
  name = name.replace(/\b(nike|nik[e_\s]{0,2}e|nikee)\b/gi, "Premium Sneakers");
  name = name.replace(/\b(adidas|adida\s*s|yeezy)\b/gi, "Luxury Sneakers");
  name = name.replace(/\b(balenciaga|balencia\s*g)\b/gi, "Luxury Sneakers");
  name = name.replace(/\b(alexander\s*mcqueen)\b/gi, "Luxury Sneakers");
  name = name.replace(/\b(lacoste|lacost\s*e)\b/gi, "Premium Sneakers");
  name = name.replace(/\b(onitsuka|tiger)\b/gi, "Premium Sneakers");
  name = name.replace(/\b(loewe)\b/gi, "Performance Shoes");
  name = name.replace(/\b(hoka)\b/gi, "Performance Shoes");
  name = name.replace(/\b(on\s*cloud|cloudtilt)\b/gi, "Performance Shoes");
  name = name.replace(/\b(new\s*balance|newbalance)\b/gi, "Performance Shoes");
  name = name.replace(/\b(loro\s*piana|loro\s*piano)\b/gi, "Premium Loafers");

  // Apparel & T-shirts
  name = name.replace(/\b(ralph\s*lauren)\b/gi, "Luxury Shirt");
  name = name.replace(/\b(christian\s*dior|dior)\b/gi, "Luxury Shirt");
  name = name.replace(/\b(dolce|gabbana)\b/gi, "Premium Shirt");
  name = name.replace(/\b(diesel|diese\s*l)\b/gi, "Luxury Tracksuit");
  name = name.replace(/\b(balmain|balmai\s*n)\b/gi, "Luxury Tracksuit");
  name = name.replace(/\b(armani\s*exchange|arman\s*i)\b/gi, "Premium Tracksuit");
  name = name.replace(/\b(boss)\b/gi, "Premium Tracksuit");
  name = name.replace(/\b(zara)\b/gi, "Classic Tracksuit");
  name = name.replace(/\b(hood\s*rich)\b/gi, "Premium Tracksuit");

  // Sunglasses
  name = name.replace(/\b(cartier)\b/gi, "Luxury Sunglasses");
  name = name.replace(/\b(prada|pradaa)\b/gi, "Premium Sunglasses");
  name = name.replace(/\b(ray\s*ban|rayban)\b/gi, "Premium Sunglasses");
  name = name.replace(/\b(oakley)\b/gi, "Premium Sunglasses");
  name = name.replace(/\b(marc\s*jacobs)\b/gi, "Premium Sunglasses");
  name = name.replace(/\b(calvin\s*klein)\b/gi, "Premium Sunglasses");
  name = name.replace(/\b(mont\s*blanc)\b/gi, "Premium Sunglasses");

  // Perfumes
  name = name.replace(/\b(acqua|gio)\b/gi, "Luxury Perfume");
  name = name.replace(/\b(tom\s*ford|tomford)\b/gi, "Luxury Perfume");
  name = name.replace(/\b(valentino)\b/gi, "Premium Perfume");
  name = name.replace(/\b(giorgio)\b/gi, "Luxury Perfume");
  name = name.replace(/\b(azzaro)\b/gi, "Luxury Perfume");
  name = name.replace(/\b(bvlgari)\b/gi, "Premium Perfume");
  name = name.replace(/\b(carolina|herrera)\b/gi, "Luxury Perfume");
  name = name.replace(/\b(givenchy)\b/gi, "Premium Perfume");
  name = name.replace(/\b(paco|rabanne)\b/gi, "Luxury Perfume");
  name = name.replace(/\b(yves|ysl)\b/gi, "Luxury Perfume");
  name = name.replace(/\b(victoria|secret)\b/gi, "Signature Perfume");

  // Clean up extra spaces and return
  name = name.replace(/\s+/g, " ").trim();
  return name;
}

async function sanitizeAllProducts() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB connected");

  // Fetch all products
  const allProducts = await Product.find({});
  console.log(`📦 Found ${allProducts.length} products to process`);

  let updated = 0;
  let noChange = 0;

  for (const product of allProducts) {
    const originalName = product.name;
    const sanitizedName = sanitizeBrandName(originalName);

    if (originalName !== sanitizedName) {
      // Update with new name
      product.name = sanitizedName;
      await product.save();
      console.log(`✏️  Updated: "${originalName}" → "${sanitizedName}"`);
      updated++;
    } else {
      noChange++;
    }
  }

  console.log(`\n✅ Sanitization complete!`);
  console.log(`   🔄 Updated: ${updated} products`);
  console.log(`   ⏭️  No changes needed: ${noChange} products`);
  console.log(`   📊 Total processed: ${allProducts.length}`);
}

sanitizeAllProducts()
  .catch((err) => {
    console.error("❌ Sanitization failed:", err?.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed");
    } catch {
      // ignore
    }
  });
