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
const DELAY_MS = 3000; // Very slow - 3 seconds between requests
const MAX_RETRIES = 2; // Reduce retries to be less aggressive

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

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
  const u = (url || "").toLowerCase();
  const rules = [
    [/mens-watch|men.?watch/, "Mens Watch"],
    [/ladies-watch|women.?watch|girls-watch/, "Ladies Watch"],
    [/sunglasses-and-frames/, "Sunglasses and Frames"],
    [/premium-sunglass|premium-sunglasses/, "Premium sunglass"],
    [/ladies-sunglasses/, "Ladies Sunglasses"],
    [/sunglasses/, "Sunglasses"],
    [/frames/, "Frames"],
    [/t-?shirts?/, "T-Shirts"],
    [/shirts?/, "Shirts"],
    [/jeans/, "Jeans"],
    [/premium-track-suits?|tracksuits?|cordset|coord-set|co-ord/, "Premium Track Suits"],
    [/track-pants?|trackpants/, "Track Pants"],
    [/hand-?bags?/, "Hand bags"],
    [/(^|\/)bags?(\/|$)/, "Bags"],
    [/perfume-for-men/, "Perfume For Men"],
    [/perfume-for-women/, "Perfume For Women"],
    [/fragrance-gift-set|gift-set/, "Fragrance Gift Set"],
    [/men.?s-shoe|mens-shoe|men-shoe|mens-shoes|footwear-men/, "Men's Shoe"],
    [/women.?s-shoes?|womens-shoes|footwear-women/, "Women's Shoes"],
    [/loafers/, "loafers"],
    [/flipflops|crocs/, "Flipflops/Crocs"],
    [/sandals|chappal/, "Sandals/Chappal"],
    [/birkenstock/, "Birkenstock"],
    [/premium-shoes?/, "Premium Shoes"],
  ];

  for (const [re, cat] of rules) {
    if (re.test(u)) return cat;
  }
  return "Other";
}

async function fetchHtml(url) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent": getRandomUserAgent(),
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-IN,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        timeout: 30000,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      return res.data;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const waitTime = 2000 * Math.pow(2, attempt - 1); // Exponential backoff: 2s, 4s, 8s
        console.log(`Retry ${attempt}/${MAX_RETRIES} after ${waitTime}ms...`);
        await sleep(waitTime);
      }
    }
  }
  throw lastError;
}

function extractWebTokenFromListing(html) {
  const m = String(html).match(/var\s+web_token\s*=\s*"([^"]+)"/);
  return m ? m[1] : "";
}

function extractTotalCountFromListing(html) {
  const $ = cheerio.load(html);
  const raw = ($("#total_result_cnt").text() || "").replace(/[^\d]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function fetchLoadMoreChunk({
  offset,
  webToken,
  searchkey = "",
  orderby = "",
  cat_ids = "",
  min_price = "",
  max_price = "",
  size_ids = "",
}) {
  const body = new URLSearchParams({
    getresult: String(offset),
    searchkey: String(searchkey),
    orderby: String(orderby),
    cat_ids: String(cat_ids),
    min_price: String(min_price),
    max_price: String(max_price),
    size_ids: String(size_ids),
    web_token: String(webToken),
  }).toString();

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.post(LOADMORE_URL, body, {
        headers: {
          "User-Agent": getRandomUserAgent(),
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "text/html,*/*;q=0.8",
          "X-Requested-With": "XMLHttpRequest",
          Referer: LISTING_URL,
          Origin: BASE_URL,
          Connection: "keep-alive",
        },
        timeout: 30000,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      return res.data;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const waitTime = 5000 * attempt; // 5s, 10s (less aggressive)
        console.log(`Load-more retry ${attempt}/${MAX_RETRIES} after ${waitTime}ms...`);
        await sleep(waitTime);
      }
    }
  }
  throw lastError;
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

function parseDetail(html, fallbackUrl) {
  const $ = cheerio.load(html);

  // try a few gallery containers, but also just collect cdn.cartpe.in images
  const imageSet = new Set();
  $("img").each((_, img) => {
    const $img = $(img);
    const src =
      $img.attr("src") ||
      $img.attr("data-src") ||
      $img.attr("data-original") ||
      $img.attr("data-lazy") ||
      "";
    const abs = toAbsoluteUrl(src);
    if (!abs) return;
    if (abs.includes("cdn.cartpe.in")) imageSet.add(abs);
  });

  // description: common locations
  const descCandidates = [
    $("#description").text(),
    $(".description").text(),
    $(".product-description").text(),
    $(".tab-content").text(),
    $("meta[name='description']").attr("content"),
  ]
    .map((t) => (t ? String(t).replace(/\s+/g, " ").trim() : ""))
    .filter(Boolean);
  const description = descCandidates[0] || undefined;

  // sizes: look for select options/buttons with size-like text
  const sizeTokens = new Set();
  $("option, button, a, span, li, div").each((_, el) => {
    const t = normalizeSizeToken($(el).text());
    if (!t) return;
    if (/^(xs|s|m|l|xl|xxl|xxxl)$/i.test(t)) sizeTokens.add(t.toUpperCase());
    if (/^\d{1,2}$/.test(t)) sizeTokens.add(t);
  });
  const sizes = [...sizeTokens];

  // sometimes name is better on detail page
  const name =
    normalizeSizeToken($("h1").first().text()) ||
    normalizeSizeToken($("h2").first().text()) ||
    undefined;

  const canonical =
    $("link[rel='canonical']").attr("href") ||
    $("meta[property='og:url']").attr("content") ||
    fallbackUrl ||
    undefined;

  return {
    name,
    images: [...imageSet],
    description,
    sizes: sizes.length ? sizes : undefined,
    productUrl: canonical ? toAbsoluteUrl(canonical) : undefined,
  };
}

async function scrapeAllListingProducts() {
  const listingHtml = await fetchHtml(LISTING_URL);
  const webToken = extractWebTokenFromListing(listingHtml);
  const totalCount = extractTotalCountFromListing(listingHtml);
  const maxProductsRaw = process.env.MAX_PRODUCTS;
  const maxProducts = maxProductsRaw ? Number(maxProductsRaw) : null;

  if (!webToken) {
    throw new Error("Could not extract web_token from listing page");
  }

  // initial 24 are already in the HTML
  const all = parseListing(listingHtml);
  console.log(
    `Scraped ${all.length} products from initial listing page${
      totalCount ? ` (total ${totalCount})` : ""
    }`
  );

  const seenKey = new Set(all.map((p) => `${p.name}__${p.productUrl}`));

  // load more via the same endpoint the site uses
  let offset = all.length;
  let emptyStreak = 0;
  let consecutiveFailures = 0;

  while (true) {
    if (Number.isFinite(maxProducts) && maxProducts > 0 && all.length >= maxProducts) {
      console.log(`Reached MAX_PRODUCTS=${maxProducts}. Stopping listing scrape.`);
      break;
    }
    if (totalCount && all.length >= totalCount) break;

    // If we hit too many failures, give up to avoid infinite loops
    if (consecutiveFailures >= 3) {
      console.log(`⚠️ Hit 3 consecutive failures. Stopping scrape (have ${all.length} products so far).`);
      break;
    }

    try {
      const chunkHtml = await fetchLoadMoreChunk({ offset, webToken });
      const chunkProducts = parseListing(`<ul>${chunkHtml}</ul>`);

      if (!chunkProducts.length) {
        emptyStreak += 1;
        if (emptyStreak >= 2) break;
      } else {
        emptyStreak = 0;
        consecutiveFailures = 0; // Reset failure counter on success
      }

    let added = 0;
    for (const p of chunkProducts) {
      const key = `${p.name}__${p.productUrl}`;
      if (seenKey.has(key)) continue;
      seenKey.add(key);
      all.push(p);
      added += 1;
    }

    console.log(
      `Loaded more: offset=${offset} received=${chunkProducts.length} added=${added} total=${all.length}${
        totalCount ? `/${totalCount}` : ""
      }`
    );

    offset += PAGE_SIZE;
    await sleep(DELAY_MS);
    } catch (err) {
      consecutiveFailures++;
      console.error(`Load-more error at offset ${offset} (attempt ${consecutiveFailures}/3): ${err.message}`);
      if (consecutiveFailures < 3) {
        const waitTime = 5000 * consecutiveFailures; // 5s, 10s, 15s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await sleep(waitTime);
      }
    }
  }

  return all;
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      results[i] = await mapper(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.max(1, limit) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function scrapeAll() {
  const listingProducts = await scrapeAllListingProducts();

  // 2600+ products * detail pages is very slow; make detail enrichment opt-in.
  const fetchDetails = process.env.DETAIL_PAGES === "1";
  if (!fetchDetails) {
    console.log(
      `DETAIL_PAGES is not set to 1; skipping detail-page scraping (set DETAIL_PAGES=1 to enable)`
    );
    return listingProducts;
  }

  const concurrency = Math.min(
    Math.max(Number(process.env.DETAIL_CONCURRENCY) || 6, 1),
    12
  );

  console.log(`Detail-page scraping enabled. Concurrency=${concurrency}`);

  const enriched = await mapLimit(listingProducts, concurrency, async (p, i) => {
    try {
      const detailHtml = await fetchHtml(p.productUrl);
      const detail = parseDetail(detailHtml, p.productUrl);

      const images = Array.from(
        new Set([...(p.images || []), ...(detail.images || [])].filter(Boolean))
      );

      return {
        ...p,
        name: detail.name || p.name,
        images: images.length ? images : p.images,
        image: p.image || images[0],
        description: detail.description || p.description,
        sizes: detail.sizes || p.sizes,
        productUrl: detail.productUrl || p.productUrl,
        slug:
          p.slug ||
          (() => {
            try {
              const u = new URL(detail.productUrl || p.productUrl);
              return u.pathname.replace(/\/+$/, "");
            } catch {
              return undefined;
            }
          })(),
        category: p.category || guessCategoryFromUrl(detail.productUrl || p.productUrl),
      };
    } catch {
      if ((i + 1) % 50 === 0) {
        console.warn(`Detail scrape failures encountered (latest: ${p.productUrl})`);
      }
      return p;
    }
  });

  return enriched;
}

async function seedProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    console.log("No products to insert");
    return { inserted: 0, skipped: 0 };
  }

  // Scalable dedupe: upsert by name, insert-only using $setOnInsert.
  // This avoids huge $in queries that break with thousands of products.
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

    const result = await Product.bulkWrite(ops, { ordered: false });
    inserted += result.upsertedCount || 0;
    processed += ops.length;

    console.log(
      `Seed progress: processed ${Math.min(start + ops.length, products.length)}/${products.length} (inserted so far ${inserted})`
    );
  }

  const skipped = processed - inserted;
  console.log(`Inserted ${inserted} products, skipped ${skipped} duplicates`);
  return { inserted, skipped };
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB connected for seeding");

  const products = await scrapeAll();
  const { inserted, skipped } = await seedProducts(products);

  console.log(
    `Done. Scraped ${products.length} products, Inserted ${inserted}, Skipped ${skipped} duplicates`
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

