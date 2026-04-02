/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const Product = require("../models/Product");

const LISTING_URL = "https://footshoppers.cartpe.in/allproduct.html";
const BASE_URL = "https://footshoppers.cartpe.in";
const LOADMORE_URL = "https://footshoppers.cartpe.in/product/allproduct_loadmore_builder";
const PAGE_SIZE = 24;
const SEED_BATCH_SIZE = 100; // Seed every 100 products scraped

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function toAbsoluteUrl(maybeUrl) {
  if (!maybeUrl) return "";
  const url = String(maybeUrl).trim();
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
}

function extractFirstNumber(text) {
  if (!text) return null;
  const cleaned = String(text).replace(/[, ]+/g, "");
  const m = cleaned.match(/(?:Rs\.?|₹)\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function extractAllPrices(text) {
  if (!text) return [];
  const s = String(text);
  const matches = [...s.matchAll(/(?:Rs\.?|₹)\s*([0-9]+(?:\.[0-9]+)?)/gi)];
  return matches
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));
}

function normalizeSizeToken(t) {
  const s = String(t || "").trim();
  if (!s) return "";
  return s.replace(/\s+/g, " ");
}

function guessCategoryFromUrl(url) {
  try {
    const u = new URL(url);
    const p = u.pathname.toLowerCase();
    if (p.includes("watch")) return "Watches";
    if (p.includes("shoe") || p.includes("sneaker") || p.includes("loafer"))
      return "Shoes";
    if (p.includes("bag") || p.includes("handbag")) return "Bags";
    if (p.includes("perfume") || p.includes("fragrance")) return "Perfumes";
    if (p.includes("glass") || p.includes("sunglass")) return "Sunglasses";
    if (p.includes("cloth") || p.includes("shirt") || p.includes("trouser"))
      return "Clothing";
  } catch {}
  return "General";
}

async function fetchHtml(url) {
  try {
    const res = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch ${url}: ${err.message}`);
    throw err;
  }
}

function extractWebTokenFromListing(html) {
  const m = html.match(/web_token\s*:\s*["']([^"']+)["']/);
  return m ? m[1] : null;
}

function extractTotalCountFromListing(html) {
  const m = html.match(/total["\s:]*(\d+)/i);
  return m ? Number(m[1]) : null;
}

async function fetchLoadMoreChunk({ offset, webToken }) {
  const p = new URLSearchParams();
  p.append("web_token", webToken);
  p.append("offset", offset);
  p.append("limit", PAGE_SIZE);
  try {
    const res = await axios.post(LOADMORE_URL, p, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch load-more chunk: ${err.message}`);
    throw err;
  }
}

function parseListing(html) {
  const $ = cheerio.load(html);

  const products = [];

  // Products appear as <li> cards.
  $("li").each((_, li) => {
    const $li = $(li);

    const aHref =
      $li.find("a[href]").first().attr("href") ||
      $li.closest("a[href]").attr("href") ||
      "";
    const productUrl = toAbsoluteUrl(aHref);

    const name =
      normalizeSizeToken($li.find("h3").first().text()) ||
      normalizeSizeToken($li.find("img[alt]").first().attr("alt")) ||
      "";

    const imgEl = $li.find("img").first();
    const thumb =
      imgEl.attr("src") ||
      imgEl.attr("data-src") ||
      imgEl.attr("data-original") ||
      imgEl.attr("data-lazy") ||
      "";
    const image = toAbsoluteUrl(thumb);

    const liText = $li.text().replace(/\s+/g, " ").trim();
    const prices = extractAllPrices(liText);
    const price = prices.length ? prices[0] : null;
    const mrp = prices.length > 1 ? prices[1] : null;

    // sizes: look for buttons/spans resembling size tokens
    const sizeTokens = new Set();
    $li.find("button, span, li, div").each((__, el) => {
      const t = normalizeSizeToken($(el).text());
      if (!t) return;
      if (/^(xs|s|m|l|xl|xxl|xxxl)$/i.test(t)) sizeTokens.add(t.toUpperCase());
      if (/^\d{1,2}$/.test(t)) sizeTokens.add(t);
    });
    const sizes = [...sizeTokens];

    if (!name || !price || !productUrl) return;

    products.push({
      name,
      price,
      mrp: mrp && mrp !== price ? mrp : undefined,
      originalPrice: mrp && mrp !== price ? mrp : undefined,
      image: image || undefined,
      images: image ? [image] : [],
      sizes: sizes.length ? sizes : undefined,
      productUrl,
      slug: (() => {
        try {
          const u = new URL(productUrl);
          return u.pathname.replace(/\/+$/, "");
        } catch {
          return undefined;
        }
      })(),
      category: guessCategoryFromUrl(productUrl),
    });
  });

  // Deduplicate by name+url from listing
  const seen = new Set();
  const unique = [];
  for (const p of products) {
    const key = `${p.name}__${p.productUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }
  return unique;
}

async function seedProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return { inserted: 0, skipped: 0 };
  }

  const BATCH_SIZE = Math.min(Math.max(Number(process.env.SEED_BATCH_SIZE) || 500, 50), 2000);

  let inserted = 0;
  let processed = 0;

  for (let start = 0; start < products.length; start += BATCH_SIZE) {
    const batch = products.slice(start, start + BATCH_SIZE);
    const ops = [];

    for (const p of batch) {
      if (!p?.name) continue;

      const doc = {};
      doc.name = p.name;
      doc.price = p.price;
      if (typeof p.mrp === "number") doc.mrp = p.mrp;
      if (typeof p.originalPrice === "number") doc.originalPrice = p.originalPrice;
      if (Array.isArray(p.images) && p.images.length) doc.images = p.images;
      if (p.image) doc.image = p.image;
      if (p.category) doc.category = p.category;
      if (Array.isArray(p.sizes) && p.sizes.length) doc.sizes = p.sizes.map(String);
      if (p.description) doc.description = p.description;
      if (p.productUrl) doc.productUrl = p.productUrl;
      if (p.slug) doc.slug = p.slug;

      ops.push({
        updateOne: {
          filter: { name: p.name },
          update: { $setOnInsert: doc },
          upsert: true,
        },
      });
    }

    if (!ops.length) continue;

    try {
      const result = await Product.bulkWrite(ops, { ordered: false });
      inserted += result.upsertedCount || 0;
      processed += ops.length;
    } catch (err) {
      console.error(`Seed batch failed: ${err.message}`);
      processed += ops.length;
    }
  }

  const skipped = processed - inserted;
  return { inserted, skipped };
}

async function scrapeAndSeedInBatches() {
  const listingHtml = await fetchHtml(LISTING_URL);
  const webToken = extractWebTokenFromListing(listingHtml);
  const totalCount = extractTotalCountFromListing(listingHtml);
  const maxProductsRaw = process.env.MAX_PRODUCTS;
  const maxProducts = maxProductsRaw ? Number(maxProductsRaw) : null;

  if (!webToken) {
    throw new Error("Could not extract web_token from listing page");
  }

  // initial 24 are already in the HTML
  const initial = parseListing(listingHtml);
  console.log(
    `Scraped ${initial.length} products from initial listing page${
      totalCount ? ` (total ${totalCount})` : ""
    }`
  );

  let allProducts = [...initial];
  const seenKey = new Set(initial.map((p) => `${p.name}__${p.productUrl}`));

  let totalInserted = 0;
  let totalSkipped = 0;

  // Seed initial batch
  if (allProducts.length > 0) {
    const { inserted, skipped } = await seedProducts(allProducts);
    totalInserted += inserted;
    totalSkipped += skipped;
    console.log(`✅ Seeded initial batch: ${inserted} inserted, ${skipped} skipped`);
  }

  // load more via the same endpoint the site uses
  let offset = initial.length;
  let emptyStreak = 0;
  let batchToSeed = [];

  while (true) {
    if (Number.isFinite(maxProducts) && maxProducts > 0 && allProducts.length >= maxProducts) {
      console.log(`Reached MAX_PRODUCTS=${maxProducts}. Stopping scrape.`);
      break;
    }
    if (totalCount && allProducts.length >= totalCount) break;

    try {
      const chunkHtml = await fetchLoadMoreChunk({ offset, webToken });
      const chunkProducts = parseListing(`<ul>${chunkHtml}</ul>`);

      if (!chunkProducts.length) {
        emptyStreak += 1;
        if (emptyStreak >= 2) break;
      } else {
        emptyStreak = 0;
      }

      let added = 0;
      for (const p of chunkProducts) {
        const key = `${p.name}__${p.productUrl}`;
        if (seenKey.has(key)) continue;
        seenKey.add(key);
        batchToSeed.push(p);
        allProducts.push(p);
        added += 1;
      }

      console.log(
        `Loaded more: offset=${offset} received=${chunkProducts.length} added=${added} total=${allProducts.length}${
          totalCount ? `/${totalCount}` : ""
        }`
      );

      // Seed in batches as products are scraped
      if (batchToSeed.length >= SEED_BATCH_SIZE) {
        const { inserted, skipped } = await seedProducts(batchToSeed);
        totalInserted += inserted;
        totalSkipped += skipped;
        console.log(
          `⏳ Seeded ${batchToSeed.length} products: ${inserted} inserted, ${skipped} skipped (DB total: ${totalInserted})`
        );
        batchToSeed = [];
      }

      offset += PAGE_SIZE;
      await sleep(250);
    } catch (err) {
      console.error(`Load more failed: ${err.message}`);
      break;
    }
  }

  // Seed any remaining products
  if (batchToSeed.length > 0) {
    const { inserted, skipped } = await seedProducts(batchToSeed);
    totalInserted += inserted;
    totalSkipped += skipped;
    console.log(
      `✅ Seeded final batch: ${inserted} inserted, ${skipped} skipped`
    );
  }

  return { total: allProducts.length, inserted: totalInserted, skipped: totalSkipped };
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB connected for optimized seeding");

  const { total, inserted, skipped } = await scrapeAndSeedInBatches();

  console.log(
    `\n✨ Done! Scraped ${total} products. Inserted ${inserted}, Skipped ${skipped} duplicates`
  );
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err?.message || err);
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
