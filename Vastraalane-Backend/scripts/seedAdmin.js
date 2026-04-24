import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Vastraleena Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env");
  }

  await connectDB();
  console.log("Connected to MongoDB");

  await User.deleteMany({ role: "admin" });
  console.log("Cleared existing admin accounts");

  const existingUser = await User.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existingUser) {
    existingUser.name = name;
    existingUser.passwordHash = passwordHash;
    existingUser.role = "admin";
    existingUser.refreshToken = "";
    await existingUser.save();
    console.log(`Admin seeded successfully: ${existingUser.email}`);
  } else {
    const admin = await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
      refreshToken: "",
    });
    console.log(`Admin seeded successfully: ${admin.email}`);
  }

  await mongoose.disconnect();
  console.log("Done. MongoDB disconnected.");
}

seedAdmin().catch(async (error) => {
  console.error("Seeding failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
