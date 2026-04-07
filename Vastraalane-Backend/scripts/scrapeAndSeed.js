/* eslint-disable no-console */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const {
  enrichProductsWithDetails,
  groupProductsByIdentity,
  PAGE_SIZE,
  scrapeListingProducts,
  summarizeProducts,
} = require("../utils/productPipeline");

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function getCheckpointPath() {
  return process.env.SEED_CHECKPOINT_FILE
    ? path.resolve(process.env.SEED_CHECKPOINT_FILE)
    : path.join(__dirname, "..", ".seed-checkpoint.json");
}

function readCheckpoint() {
  const checkpointPath = getCheckpointPath();

  try {
    if (!fs.existsSync(checkpointPath)) {
      return {
        checkpointPath,
        state: null,
      };
    }

    const state = JSON.parse(fs.readFileSync(checkpointPath, "utf8"));
    return { checkpointPath, state };
  } catch (error) {
    console.warn(`[seed] could not read checkpoint: ${error.message}`);
    return { checkpointPath, state: null };
  }
}

function writeCheckpoint(payload) {
  const checkpointPath = getCheckpointPath();
  fs.writeFileSync(checkpointPath, JSON.stringify(payload, null, 2));
}

function clearCheckpoint() {
  const checkpointPath = getCheckpointPath();
  if (fs.existsSync(checkpointPath)) {
    fs.unlinkSync(checkpointPath);
  }
}

async function upsertProducts(products, batchSize) {
  let inserted = 0;
  let updated = 0;
  let failed = 0;

  const chunks = chunkArray(products, batchSize);

  for (const [chunkIndex, batch] of chunks.entries()) {
    const operations = batch.map((product) => ({
      updateOne: {
        filter: { identityKey: product.identityKey },
        update: {
          $set: {
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            originalPrice: product.originalPrice,
            images: product.images,
            image: product.images[0],
            category: product.category,
            sizes: product.sizes,
            description: product.description,
            productUrl: product.productUrl,
            slug: product.slug,
            identityKey: product.identityKey,
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    try {
      const result = await Product.bulkWrite(operations, { ordered: false });
      inserted += result.upsertedCount || 0;
      updated += result.modifiedCount || 0;

      console.log(
        `[seed] batch ${chunkIndex + 1}/${chunks.length} processed=${batch.length} inserted=${inserted} updated=${updated} failed=${failed}`
      );
    } catch (error) {
      const batchFailures = error?.writeErrors?.length || batch.length;
      failed += batchFailures;
      console.error(
        `[seed] batch ${chunkIndex + 1}/${chunks.length} failed for ${batchFailures} products: ${error.message}`
      );
    }
  }

  return { inserted, updated, failed };
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(mongoUri);
  console.log("[seed] MongoDB connected");

  const detailPagesEnabled = String(process.env.DETAIL_PAGES || "1") !== "0";
  const batchSize = Math.min(
    Math.max(Number(process.env.SEED_BATCH_SIZE || 500), 50),
    2000
  );
  const enrichChunkSize = Math.min(
    Math.max(Number(process.env.ENRICH_CHUNK_SIZE || 500), 50),
    2000
  );
  const resumeEnabled = String(process.env.SEED_RESUME || "1") !== "0";
  const { checkpointPath, state: checkpointState } = readCheckpoint();
  const existingDbCount = await Product.countDocuments();
  const estimatedOffsetFromDb = Math.max(
    Math.floor(Math.max(existingDbCount - PAGE_SIZE * 2, 0) / PAGE_SIZE) * PAGE_SIZE,
    0
  );
  const checkpointOffset =
    resumeEnabled && checkpointState?.nextOffset && Number(checkpointState.nextOffset) > 0
      ? Number(checkpointState.nextOffset)
      : 0;
  const resumeOffset = Math.max(checkpointOffset, estimatedOffsetFromDb);

  let upsertSummary = { inserted: 0, updated: 0, failed: 0 };
  let totalRawRecords = 0;
  let totalGroupedProducts = 0;
  let totalSkippedDuplicates = 0;
  let totalInvalidRecords = 0;
  let totalZeroImages = 0;
  let totalMultipleImages = 0;
  let failedDetailFetches = 0;
  let listingReportedTotal = null;
  const listingBuffer = [];

  if (resumeOffset) {
    console.log(
      `[seed] resume checkpoint found at offset=${resumeOffset} (${checkpointPath})`
    );
  } else if (resumeEnabled) {
    console.log(`[seed] no resume checkpoint found (${checkpointPath})`);
  } else {
    console.log("[seed] resume checkpoints disabled via SEED_RESUME=0");
  }

  if (resumeEnabled && estimatedOffsetFromDb > checkpointOffset) {
    console.log(
      `[seed] resume offset bootstrapped from database count=${existingDbCount} to offset=${estimatedOffsetFromDb}`
    );
  }

  async function processChunk(chunk, chunkLabel = "") {
    let chunkProducts = chunk;

    if (detailPagesEnabled) {
      const detailResult = await enrichProductsWithDetails(chunk, {
        detailConcurrency: Number(process.env.DETAIL_CONCURRENCY || 8),
        detailDelayMs: Number(process.env.DETAIL_DELAY_MS || 0),
      });
      chunkProducts = detailResult.products;
      failedDetailFetches += detailResult.failedDetailFetches;
    } else if (totalRawRecords === 0) {
      console.log("[seed] detail-page enrichment disabled via DETAIL_PAGES=0");
    }

    const grouped = groupProductsByIdentity(chunkProducts);
    const chunkSummary = summarizeProducts(grouped.products, {
      listingReportedTotal,
      rawRecordsBeforeGrouping: chunkProducts.length,
      skippedDuplicates: grouped.stats.skippedDuplicates,
      invalidRecords: grouped.stats.invalidRecords,
    });

    totalRawRecords += chunkProducts.length;
    totalGroupedProducts += grouped.products.length;
    totalSkippedDuplicates += chunkSummary.skippedDuplicates;
    totalInvalidRecords += chunkSummary.invalidRecords;
    totalZeroImages += chunkSummary.productsWithZeroImages;
    totalMultipleImages += chunkSummary.productsWithMultipleImages;

    const chunkUpsert = await upsertProducts(grouped.products, batchSize);
    upsertSummary.inserted += chunkUpsert.inserted;
    upsertSummary.updated += chunkUpsert.updated;
    upsertSummary.failed += chunkUpsert.failed;

    console.log(
      `[seed] progress${chunkLabel ? ` ${chunkLabel}` : ""} raw=${totalRawRecords} grouped=${totalGroupedProducts} inserted=${upsertSummary.inserted} updated=${upsertSummary.updated} failedInserts=${upsertSummary.failed} failedDetailFetches=${failedDetailFetches}`
    );
  }

  const scrapeResult = await scrapeListingProducts({
    delayMs: Number(process.env.LISTING_DELAY_MS || 250),
    maxProducts: process.env.MAX_PRODUCTS,
    startOffset: resumeOffset,
    onChunkAdded: async (addedProducts) => {
      listingBuffer.push(...addedProducts);

      while (listingBuffer.length >= enrichChunkSize) {
        const chunk = listingBuffer.splice(0, enrichChunkSize);
        await processChunk(chunk, "(progressive)");
      }
    },
    onOffsetProcessed: async ({ currentOffset, nextOffset, totalCount, batchReceived, batchAdded }) => {
      if (!resumeEnabled) return;

      writeCheckpoint({
        updatedAt: new Date().toISOString(),
        currentOffset,
        nextOffset,
        totalCount,
        batchReceived,
        batchAdded,
      });
    },
  });

  listingReportedTotal = scrapeResult.totalCount;

  while (listingBuffer.length) {
    const chunk = listingBuffer.splice(0, enrichChunkSize);
    await processChunk(chunk, "(finalize)");
  }

  const seedSummary = {
    totalScraped: totalGroupedProducts,
    listingReportedTotal,
    rawRecordsBeforeGrouping: totalRawRecords,
    skippedDuplicates: totalSkippedDuplicates,
    invalidRecords: totalInvalidRecords,
    failedDetailFetches,
    productsWithZeroImages: totalZeroImages,
    productsWithMultipleImages: totalMultipleImages,
  };

  console.log("[seed] scrape summary");
  console.log(JSON.stringify(seedSummary, null, 2));

  const dbCount = await Product.countDocuments();
  const diagnostics = {
    totalScraped: seedSummary.totalScraped,
    listingReportedTotal: seedSummary.listingReportedTotal,
    skippedDuplicates: seedSummary.skippedDuplicates,
    invalidRecords: seedSummary.invalidRecords,
    failedDetailFetches: seedSummary.failedDetailFetches,
    failedInserts: upsertSummary.failed,
    inserted: upsertSummary.inserted,
    updated: upsertSummary.updated,
    productsWithZeroImages: seedSummary.productsWithZeroImages,
    productsWithMultipleImages: seedSummary.productsWithMultipleImages,
    databaseCountAfterSeed: dbCount,
    scrapeToSeedGap: seedSummary.totalScraped - dbCount,
  };

  console.log("[seed] final diagnostics");
  console.log(JSON.stringify(diagnostics, null, 2));

  if (resumeEnabled) {
    clearCheckpoint();
    console.log("[seed] cleared resume checkpoint after successful completion");
  }
}

main()
  .catch((error) => {
    console.error("[seed] failed:", error?.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
      console.log("[seed] MongoDB connection closed");
    } catch {
      // ignore close failures
    }
  });
