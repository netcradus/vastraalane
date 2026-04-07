const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://footshoppers.cartpe.in";
const LISTING_URL = `${BASE_URL}/allproduct.html`;
const LOADMORE_URL = `${BASE_URL}/product/allproduct_loadmore_builder`;
const PAGE_SIZE = 24;

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function isLikelyProductName(value) {
  const normalized = normalizeWhitespace(value).toLowerCase();
  if (!normalized) return false;
  if (normalized.length < 4) return false;

  const bannedFragments = [
    "free shipping",
    "easy exchange",
    "cash on delivery",
    "customer care",
    "shop now",
    "add to cart",
    "buy now",
    "wishlist",
    "related products",
  ];

  return !bannedFragments.some((fragment) => normalized.includes(fragment));
}

function normalizeImageUrl(url) {
  if (!url) return "";

  try {
    const absolute = new URL(toAbsoluteUrl(url));
    absolute.hash = "";
    return absolute.toString();
  } catch {
    return String(url || "").trim();
  }
}

function getImageVariantRank(url) {
  const value = String(url || "").toLowerCase();
  if (value.includes("/gallery_lg/")) return 3;
  if (value.includes("/gallery_md/")) return 2;
  if (value.includes("/gallery_sm/")) return 1;
  return 0;
}

function getImageIdentity(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.split("/").filter(Boolean).pop() || parsed.pathname;
  } catch {
    return String(url || "").trim();
  }
}

function normalizeUrlForIdentity(url) {
  if (!url) return "";

  try {
    const absolute = new URL(toAbsoluteUrl(url));
    absolute.hash = "";
    absolute.search = "";
    return absolute.toString().replace(/\/+$/, "");
  } catch {
    return String(url || "").trim().replace(/\/+$/, "");
  }
}

function slugify(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildIdentityKey(product) {
  const slug = slugify(product.slug);
  const productUrl = normalizeUrlForIdentity(product.productUrl);
  const name = slugify(product.name);

  if (slug) return `slug:${slug}`;
  if (productUrl) return `url:${productUrl}`;
  return `name:${name}`;
}

function uniqueStrings(values) {
  const seen = new Set();
  const result = [];

  for (const value of values || []) {
    const normalized = String(value || "").trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function mergeImageUrls(values) {
  const selectedByIdentity = new Map();

  for (const value of values || []) {
    const normalized = normalizeImageUrl(value);
    if (!normalized) continue;

    const identity = getImageIdentity(normalized);
    const existing = selectedByIdentity.get(identity);
    if (!existing || getImageVariantRank(normalized) > getImageVariantRank(existing)) {
      selectedByIdentity.set(identity, normalized);
    }
  }

  return Array.from(selectedByIdentity.values());
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

function extractAllPrices(text) {
  if (!text) return [];
  const matches = [
    ...String(text).matchAll(/(?:rs\.?|₹|â‚¹)\s*([0-9]+(?:\.[0-9]+)?)/gi),
  ];

  return matches
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));
}

function guessCategoryFromUrl(url) {
  const value = String(url || "").toLowerCase();
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
    [/loafers/, "Loafers"],
    [/flipflops|crocs/, "Flipflops/Crocs"],
    [/sandals|chappal/, "Sandals/Chappal"],
    [/birkenstock/, "Birkenstock"],
    [/premium-shoes?/, "Premium Shoes"],
  ];

  for (const [pattern, category] of rules) {
    if (pattern.test(value)) return category;
  }

  return "Other";
}

function buildSlugFromUrl(productUrl, fallbackName) {
  try {
    const parsed = new URL(productUrl);
    const pathname = parsed.pathname.replace(/\/+$/, "");
    if (pathname && pathname !== "/") {
      return pathname.split("/").filter(Boolean).join("-");
    }
  } catch {
    // ignore and use fallback
  }

  return slugify(fallbackName);
}

function normalizeProductRecord(record) {
  const images = mergeImageUrls([
    record.image,
    record.img,
    ...(Array.isArray(record.images) ? record.images : []),
  ]);
  const productUrl = normalizeUrlForIdentity(record.productUrl);
  const slug = slugify(record.slug || buildSlugFromUrl(productUrl, record.name));

  return {
    name: normalizeWhitespace(record.name),
    price: Number(record.price || 0),
    mrp: Number.isFinite(Number(record.mrp)) ? Number(record.mrp) : undefined,
    originalPrice: Number.isFinite(Number(record.originalPrice))
      ? Number(record.originalPrice)
      : undefined,
    images,
    image: images[0],
    category: normalizeWhitespace(record.category) || guessCategoryFromUrl(productUrl),
    sizes: uniqueStrings(record.sizes || []),
    description: normalizeWhitespace(record.description) || undefined,
    productUrl: productUrl || undefined,
    slug: slug || undefined,
    identityKey: buildIdentityKey({
      slug,
      productUrl,
      name: record.name,
    }),
  };
}

function mergeProducts(existing, incoming) {
  const merged = normalizeProductRecord({
    ...existing,
    ...incoming,
    name: incoming.name || existing.name,
    price: incoming.price || existing.price,
    mrp: incoming.mrp || existing.mrp,
    originalPrice: incoming.originalPrice || existing.originalPrice,
    description: incoming.description || existing.description,
    category: incoming.category || existing.category,
    productUrl: incoming.productUrl || existing.productUrl,
    slug: incoming.slug || existing.slug,
    sizes: [...(existing.sizes || []), ...(incoming.sizes || [])],
    images: [...(existing.images || []), ...(incoming.images || [])],
    image: incoming.image || existing.image,
  });

  return merged;
}

function groupProductsByIdentity(records) {
  const grouped = new Map();
  let invalidRecords = 0;

  for (const record of records || []) {
    const normalized = normalizeProductRecord(record);
    if (!normalized.name || !normalized.price || !normalized.identityKey) {
      invalidRecords += 1;
      continue;
    }

    const existing = grouped.get(normalized.identityKey);
    grouped.set(
      normalized.identityKey,
      existing ? mergeProducts(existing, normalized) : normalized
    );
  }

  const products = Array.from(grouped.values());
  const productsWithZeroImages = products.filter((product) => product.images.length === 0).length;
  const productsWithMultipleImages = products.filter((product) => product.images.length > 1).length;

  return {
    products,
    stats: {
      rawRecords: Array.isArray(records) ? records.length : 0,
      groupedProducts: products.length,
      skippedDuplicates: Math.max((records || []).length - products.length - invalidRecords, 0),
      invalidRecords,
      productsWithZeroImages,
      productsWithMultipleImages,
    },
  };
}

async function requestWithRetry(requestFactory, { maxRetries = 4, baseDelayMs = 1200, onRetry } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      return await requestFactory();
    } catch (error) {
      lastError = error;
      if (attempt >= maxRetries) break;

      const waitMs = baseDelayMs * Math.pow(2, attempt - 1);
      if (typeof onRetry === "function") {
        onRetry({ attempt, waitMs, error });
      }
      await sleep(waitMs);
    }
  }

  throw lastError;
}

async function fetchHtml(url) {
  const target = toAbsoluteUrl(url);
  const response = await requestWithRetry(
    () =>
      axios.get(target, {
        headers: {
          "User-Agent": getRandomUserAgent(),
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-IN,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        timeout: 30000,
        validateStatus: (status) => status >= 200 && status < 400,
      }),
    {
      onRetry: ({ attempt, waitMs, error }) => {
        console.log(
          `[scraper] retrying html fetch ${target} after failure ${attempt}: ${error.message}. Waiting ${waitMs}ms`
        );
      },
    }
  );

  return response.data;
}

function extractWebTokenFromListing(html) {
  const patterns = [
    /var\s+web_token\s*=\s*"([^"]+)"/,
    /web_token\s*:\s*["']([^"']+)["']/,
    /name="web_token"\s+value="([^"]+)"/,
  ];

  for (const pattern of patterns) {
    const match = String(html).match(pattern);
    if (match) return match[1];
  }

  return "";
}

function extractTotalCountFromListing(html) {
  const $ = cheerio.load(html);
  const explicit = normalizeWhitespace($("#total_result_cnt").text()).replace(/[^\d]/g, "");
  if (explicit) return Number(explicit);

  const fallbackMatch = String(html).match(/total[^0-9]{0,20}(\d{2,6})/i);
  return fallbackMatch ? Number(fallbackMatch[1]) : null;
}

async function fetchLoadMoreChunk({ offset, webToken }) {
  const body = new URLSearchParams({
    getresult: String(offset),
    searchkey: "",
    orderby: "",
    cat_ids: "",
    min_price: "",
    max_price: "",
    size_ids: "",
    web_token: String(webToken),
  }).toString();

  const response = await requestWithRetry(
    () =>
      axios.post(LOADMORE_URL, body, {
        headers: {
          "User-Agent": getRandomUserAgent(),
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "text/html,*/*;q=0.8",
          "X-Requested-With": "XMLHttpRequest",
          Referer: LISTING_URL,
          Origin: BASE_URL,
        },
        timeout: 30000,
        validateStatus: (status) => status >= 200 && status < 400,
      }),
    {
      baseDelayMs: 2000,
      onRetry: ({ attempt, waitMs, error }) => {
        console.log(
          `[scraper] retrying load-more offset=${offset} after failure ${attempt}: ${error.message}. Waiting ${waitMs}ms`
        );
      },
    }
  );

  return response.data;
}

function parseListing(html) {
  const $ = cheerio.load(html);
  const products = [];

  $("li").each((_, li) => {
    const $li = $(li);
    const link = $li.find("a[href]").first().attr("href") || "";
    const productUrl = toAbsoluteUrl(link);
    const imageCandidate =
      $li.find("img").first().attr("src") ||
      $li.find("img").first().attr("data-src") ||
      $li.find("img").first().attr("data-original") ||
      $li.find("img").first().attr("data-lazy") ||
      "";

    const name =
      normalizeWhitespace($li.find("h3").first().text()) ||
      normalizeWhitespace($li.find("img[alt]").first().attr("alt"));
    const prices = extractAllPrices($li.text());
    const sizes = [];

    $li.find("button, span, div, li").each((__, element) => {
      const token = normalizeWhitespace($(element).text());
      if (/^(xs|s|m|l|xl|xxl|xxxl)$/i.test(token) || /^\d{1,2}$/.test(token)) {
        sizes.push(token.toUpperCase());
      }
    });

    if (!name || !productUrl || !prices.length) return;

    products.push(
      normalizeProductRecord({
        name,
        price: prices[0],
        mrp: prices[1] && prices[1] !== prices[0] ? prices[1] : undefined,
        originalPrice: prices[1] && prices[1] !== prices[0] ? prices[1] : undefined,
        image: imageCandidate,
        images: imageCandidate ? [imageCandidate] : [],
        productUrl,
        slug: buildSlugFromUrl(productUrl, name),
        sizes,
        category: guessCategoryFromUrl(productUrl),
      })
    );
  });

  return groupProductsByIdentity(products).products;
}

function parseDetailPage(html, fallbackUrl) {
  const $ = cheerio.load(html);
  const galleryByIdentity = new Map();

  const highResolutionMatches = [
    ...String(html).matchAll(
      /https?:\/\/cdn\.cartpe\.in\/images\/gallery_(?:md|lg)\/[a-z0-9_-]+\.(?:jpg|jpeg|png|webp)/gi
    ),
  ].map((match) => normalizeImageUrl(match[0]));

  for (const imageUrl of highResolutionMatches) {
    const identity = getImageIdentity(imageUrl);
    const existing = galleryByIdentity.get(identity);
    if (!existing || getImageVariantRank(imageUrl) > getImageVariantRank(existing)) {
      galleryByIdentity.set(identity, imageUrl);
    }
  }

  if (!galleryByIdentity.size) {
    $("body")
      .find("*")
      .each((_, element) => {
        const text = normalizeWhitespace($(element).text());
        if (/related products/i.test(text)) {
          return false;
        }

        const candidates = [];
        if (element.tagName === "a") {
          candidates.push($(element).attr("href"));
        }
        if (element.tagName === "img") {
          candidates.push(
            $(element).attr("src"),
            $(element).attr("data-src"),
            $(element).attr("data-original"),
            $(element).attr("data-lazy")
          );
        }

        for (const candidate of candidates) {
          const absolute = normalizeImageUrl(candidate);
          if (!absolute || !absolute.includes("/images/gallery_")) continue;

          const identity = getImageIdentity(absolute);
          const existing = galleryByIdentity.get(identity);
          if (!existing || getImageVariantRank(absolute) > getImageVariantRank(existing)) {
            galleryByIdentity.set(identity, absolute);
          }
        }

        return undefined;
      });
  }

  const images = Array.from(galleryByIdentity.values());

  const descriptionCandidates = [
    $("#description").text(),
    $(".description").text(),
    $(".product-description").text(),
    $(".tab-content").text(),
    $('meta[name="description"]').attr("content"),
  ]
    .map(normalizeWhitespace)
    .filter(Boolean);

  const sizes = [];
  $("option, button, span, li, div").each((_, element) => {
    const token = normalizeWhitespace($(element).text());
    if (/^(xs|s|m|l|xl|xxl|xxxl)$/i.test(token) || /^\d{1,2}$/.test(token)) {
      sizes.push(token.toUpperCase());
    }
  });

  const canonical =
    $('link[rel="canonical"]').attr("href") ||
    $('meta[property="og:url"]').attr("content") ||
    fallbackUrl;

  return normalizeProductRecord({
    name: (() => {
      const candidates = [
        normalizeWhitespace($("h1").first().text()),
        normalizeWhitespace($("h2").first().text()),
      ].filter(Boolean);

      return candidates.find(isLikelyProductName);
    })(),
    images,
    sizes,
    description: descriptionCandidates[0],
    productUrl: canonical,
  });
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (true) {
      const index = currentIndex;
      currentIndex += 1;

      if (index >= items.length) return;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.max(limit, 1) }, () => worker()));
  return results;
}

async function scrapeListingProducts(options = {}) {
  const delayMs = Number(options.delayMs || 300);
  const maxProducts = Number(options.maxProducts || 0) || null;
  const onChunkAdded = typeof options.onChunkAdded === "function" ? options.onChunkAdded : null;
  const onOffsetProcessed =
    typeof options.onOffsetProcessed === "function" ? options.onOffsetProcessed : null;
  const startOffset = Math.max(Number(options.startOffset || 0) || 0, 0);
  const listingHtml = await fetchHtml(LISTING_URL);
  const webToken = extractWebTokenFromListing(listingHtml);
  const totalCount = extractTotalCountFromListing(listingHtml);

  if (!webToken) {
    throw new Error("Could not extract web token from listing page");
  }

  const seen = new Set();
  const allRecords = [];

  async function appendChunk(chunk) {
    const addedProducts = [];
    for (const product of chunk) {
      if (maxProducts && allRecords.length >= maxProducts) break;
      if (seen.has(product.identityKey)) continue;
      seen.add(product.identityKey);
      allRecords.push(product);
      addedProducts.push(product);
    }

    if (onChunkAdded && addedProducts.length) {
      await onChunkAdded(addedProducts);
    }
  }

  if (startOffset < PAGE_SIZE) {
    await appendChunk(parseListing(listingHtml));
    console.log(
      `[scraper] initial listing page yielded ${allRecords.length} products${totalCount ? ` of ${totalCount}` : ""}`
    );
  } else {
    console.log(
      `[scraper] resuming listing from offset=${startOffset}${totalCount ? ` of ${totalCount}` : ""}`
    );
  }

  let offset = startOffset >= PAGE_SIZE ? startOffset : PAGE_SIZE;
  let emptyStreak = 0;

  while (true) {
    if (maxProducts && allRecords.length >= maxProducts) break;
    if (totalCount && allRecords.length >= totalCount) break;

    const chunkHtml = await fetchLoadMoreChunk({ offset, webToken });
    const chunkProducts = parseListing(`<ul>${chunkHtml}</ul>`);

    if (!chunkProducts.length) {
      emptyStreak += 1;
      if (emptyStreak >= 3) break;
    } else {
      emptyStreak = 0;
    }

    const before = allRecords.length;
    await appendChunk(chunkProducts);
    const added = allRecords.length - before;

    console.log(
      `[scraper] offset=${offset} received=${chunkProducts.length} added=${added} total=${allRecords.length}${totalCount ? `/${totalCount}` : ""}`
    );

    if (onOffsetProcessed) {
      await onOffsetProcessed({
        currentOffset: offset,
        nextOffset: offset + PAGE_SIZE,
        totalCount,
        batchReceived: chunkProducts.length,
        batchAdded: added,
      });
    }

    offset += PAGE_SIZE;
    await sleep(delayMs);
  }

  return {
    products: allRecords,
    totalCount,
  };
}

async function enrichProductsWithDetails(listingProducts, options = {}) {
  const detailConcurrency = Math.min(Math.max(Number(options.detailConcurrency || 8), 1), 12);
  const detailDelayMs = Number(options.detailDelayMs || 0);
  let failedDetailFetches = 0;

  const enriched = await mapLimit(listingProducts, detailConcurrency, async (product, index) => {
    try {
      const html = await fetchHtml(product.productUrl);
      if (detailDelayMs) {
        await sleep(detailDelayMs);
      }
      return mergeProducts(product, parseDetailPage(html, product.productUrl));
    } catch (error) {
      failedDetailFetches += 1;
      if ((index + 1) % 50 === 0 || failedDetailFetches <= 5) {
        console.warn(
          `[scraper] detail fetch failed for ${product.productUrl}: ${error.message}`
        );
      }
      return product;
    }
  });

  return {
    products: enriched,
    failedDetailFetches,
  };
}

function summarizeProducts(products, extra = {}) {
  const zeroImages = products.filter((product) => product.images.length === 0).length;
  const multiImages = products.filter((product) => product.images.length > 1).length;

  return {
    totalScraped: products.length,
    productsWithZeroImages: zeroImages,
    productsWithMultipleImages: multiImages,
    ...extra,
  };
}

module.exports = {
  BASE_URL,
  LISTING_URL,
  LOADMORE_URL,
  PAGE_SIZE,
  buildIdentityKey,
  fetchHtml,
  groupProductsByIdentity,
  mergeProducts,
  normalizeProductRecord,
  parseDetailPage,
  parseListing,
  scrapeListingProducts,
  enrichProductsWithDetails,
  summarizeProducts,
};
