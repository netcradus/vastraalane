import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { configureDnsForSrv } from "../utils/dns.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://netcradus_db_user:gwQGRJs7Y4WFbHda@cluster0.zcdpx8c.mongodb.net/client_vastraleena?retryWrites=true&w=majority";

const CLOUDINARY_FOLDER = "vastraleena";
const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_CONCURRENCY = 6;
const PRODUCT_MIGRATION_MODE = String(process.env.MIGRATION_PRODUCT_MODE || "full").trim().toLowerCase();
const VERBOSE_MIGRATION_LOGS = String(process.env.MIGRATION_VERBOSE_LOGS || "").trim().toLowerCase() === "true";

const uploadCache = new Map();

function isCloudinaryUrl(value) {
  return typeof value === "string" && value.includes("res.cloudinary.com");
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

function isDataUri(value) {
  return /^data:image\/[a-z0-9.+-]+;base64,/i.test(String(value || ""));
}

function looksLikeBase64(value) {
  const source = String(value || "").trim();
  return source.length > 100 && /^[A-Za-z0-9+/=\r\n]+$/.test(source);
}

function inferMimeType(base64Value) {
  const source = String(base64Value || "").slice(0, 24);

  if (source.startsWith("/9j/")) return "image/jpeg";
  if (source.startsWith("iVBORw0KGgo")) return "image/png";
  if (source.startsWith("UklGR")) return "image/webp";
  if (source.startsWith("R0lGOD")) return "image/gif";

  return "image/jpeg";
}

function resolveLocalPath(value) {
  const source = String(value || "").trim();
  if (!source || isHttpUrl(source) || isDataUri(source) || looksLikeBase64(source)) {
    return "";
  }

  const candidates = [
    source,
    path.resolve(backendRoot, source),
    path.resolve(backendRoot, source.replace(/^\/+/, "")),
    path.resolve(backendRoot, "uploads", source),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || "";
}

function toUploadSource(value) {
  if (!value) return "";

  if (Buffer.isBuffer(value)) {
    return `data:image/jpeg;base64,${value.toString("base64")}`;
  }

  if (value?._bsontype === "Binary" && value.buffer) {
    return `data:image/jpeg;base64,${Buffer.from(value.buffer).toString("base64")}`;
  }

  if (typeof value !== "string") {
    return "";
  }

  const source = value.trim();
  if (!source || isCloudinaryUrl(source)) return "";
  if (isHttpUrl(source) || isDataUri(source)) return source;

  const localPath = resolveLocalPath(source);
  if (localPath) return localPath;

  if (looksLikeBase64(source)) {
    return `data:${inferMimeType(source)};base64,${source.replace(/\s/g, "")}`;
  }

  return "";
}

async function uploadToCloudinary(imageData, publicId) {
  const uploadSource = toUploadSource(imageData);
  if (!uploadSource) return null;

  if (uploadCache.has(uploadSource)) {
    return uploadCache.get(uploadSource);
  }

  const result = await cloudinary.uploader.upload(uploadSource, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });

  const upload = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  uploadCache.set(uploadSource, upload);
  return upload;
}

async function migrateImageValue(value, publicId) {
  if (!value || isCloudinaryUrl(value)) {
    return { changed: false, value };
  }

  const upload = await uploadToCloudinary(value, publicId);
  if (!upload) {
    return { changed: false, value };
  }

  return { changed: true, value: upload.url, publicId: upload.publicId };
}

async function migrateProductImages(product) {
  let changed = false;
  const docUploadCache = new Map();
  const migratePrimaryOnly = PRODUCT_MIGRATION_MODE === "primary-only" || PRODUCT_MIGRATION_MODE === "hybrid-primary";

  async function migrateProductImageValue(value, publicId) {
    const uploadSource = toUploadSource(value);
    if (!uploadSource) {
      return { changed: false, value };
    }

    if (docUploadCache.has(uploadSource)) {
      const upload = docUploadCache.get(uploadSource);
      return { changed: true, value: upload.url, publicId: upload.publicId };
    }

    const result = await uploadToCloudinary(value, publicId);
    if (!result) {
      return { changed: false, value };
    }

    docUploadCache.set(uploadSource, result);
    return { changed: true, value: result.url, publicId: result.publicId };
  }

  const primary = await migrateProductImageValue(product.image, `product_${product._id}_image`);
  if (primary.changed) {
    product.image = primary.value;
    changed = true;
  }

  if (migratePrimaryOnly) {
    return changed;
  }

  if (Array.isArray(product.images)) {
    const nextImages = [];

    for (const [index, image] of product.images.entries()) {
      if (typeof image === "string" || Buffer.isBuffer(image) || image?._bsontype === "Binary") {
        const result = await migrateProductImageValue(image, `product_${product._id}_images_${index}`);
        nextImages.push(result.changed ? { url: result.value, publicId: result.publicId || "" } : image);
        changed = changed || result.changed;
        continue;
      }

      if (image && typeof image === "object") {
        const source = image.url || image.src || image.path || image.data;
        const result = await migrateProductImageValue(source, `product_${product._id}_images_${index}`);
        nextImages.push(result.changed ? { ...image, url: result.value, publicId: result.publicId || image.publicId || "" } : image);
        changed = changed || result.changed;
        continue;
      }

      nextImages.push(image);
    }

    if (changed) {
      product.images = nextImages;
      product.markModified("images");
    }
  }

  return changed;
}

async function migrateSimpleField(doc, field, publicIdPrefix) {
  const result = await migrateImageValue(doc[field], `${publicIdPrefix}_${doc._id}_${field}`);
  if (!result.changed) return false;

  doc[field] = result.value;
  return true;
}

async function migrateOrderItemImages(order) {
  let changed = false;

  for (const [index, item] of (order.items || []).entries()) {
    const result = await migrateImageValue(item.image, `order_${order._id}_items_${index}_image`);
    if (result.changed) {
      item.image = result.value;
      changed = true;
    }
  }

  if (changed) {
    order.markModified("items");
  }

  return changed;
}

async function migrateCollection(Model, migrateDoc) {
  const query = buildPendingQuery(Model);
  const total = await Model.countDocuments(query);
  console.log(`\nMigrating ${Model.modelName}: ${total} pending documents found`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  async function migrateOne(doc) {
    try {
      const changed = await migrateDoc(doc);

      if (changed) {
        await doc.save();
        success += 1;
        if (VERBOSE_MIGRATION_LOGS) {
          console.log(`  Migrated: ${doc._id}`);
        }
      } else {
        skipped += 1;
      }
    } catch (error) {
      failed += 1;
      console.error(`  Failed for ${doc._id}: ${error.message}`);
    }
  }

  const batchSize = Number(process.env.MIGRATION_BATCH_SIZE || DEFAULT_BATCH_SIZE);
  const concurrency = Number(process.env.MIGRATION_CONCURRENCY || DEFAULT_CONCURRENCY);
  let lastId = null;

  while (true) {
    const pagedQuery = lastId ? { $and: [query, { _id: { $gt: lastId } }] } : query;
    const docs = await Model.find(pagedQuery).sort({ _id: 1 }).limit(batchSize);

    if (!docs.length) break;

    for (let index = 0; index < docs.length; index += concurrency) {
      await Promise.all(docs.slice(index, index + concurrency).map(migrateOne));
    }

    lastId = docs[docs.length - 1]._id;
    console.log(`  Progress: ${Math.min(success + skipped + failed, total)}/${total}`);
  }

  console.log(`  Done - Success: ${success}, Skipped: ${skipped}, Failed: ${failed}`);
}

function buildPendingQuery(Model) {
  switch (Model.modelName) {
    case "Product":
      if (PRODUCT_MIGRATION_MODE === "primary-only" || PRODUCT_MIGRATION_MODE === "hybrid-primary") {
        return {
          image: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ },
        };
      }

      return {
        $or: [
          { image: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ } },
          { images: { $elemMatch: { $type: "string", $not: /cloudinary\.com/ } } },
          { images: { $elemMatch: { url: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ } } } },
          { images: { $elemMatch: { src: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ } } } },
          { images: { $elemMatch: { path: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ } } } },
          { images: { $elemMatch: { data: { $exists: true, $nin: ["", null] } } } },
        ],
      };
    case "Category":
      return { image: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ } };
    case "User":
      return { avatar: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ } };
    case "Order":
      return { items: { $elemMatch: { image: { $exists: true, $nin: ["", null], $not: /cloudinary\.com/ } } } };
    default:
      return {};
  }
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  configureDnsForSrv();
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  console.log(`Product migration mode: ${PRODUCT_MIGRATION_MODE}`);

  await migrateCollection(Product, migrateProductImages);
  await migrateCollection(Category, (category) => migrateSimpleField(category, "image", "category"));
  await migrateCollection(User, (user) => migrateSimpleField(user, "avatar", "user"));
  await migrateCollection(Order, migrateOrderItemImages);

  await mongoose.disconnect();
  console.log("\nMigration complete. MongoDB disconnected.");
}

main().catch(async (error) => {
  console.error("Migration failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
