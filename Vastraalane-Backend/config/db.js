import mongoose from "mongoose";
import { configureDnsForSrv } from "../utils/dns.js";

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to backend/.env.");
  }

  if (process.env.MONGO_URI.startsWith("mongodb+srv://")) {
    configureDnsForSrv();
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
