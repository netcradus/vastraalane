import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

function resolveToken(req) {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  return req.cookies?.accessToken || null;
}

export const protect = asyncHandler(async (req, res, next) => {
  const token = resolveToken(req);

  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.userId).select("-passwordHash -refreshToken");

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  next();
});

export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  next();
}
