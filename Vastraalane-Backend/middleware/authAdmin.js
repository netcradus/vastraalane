import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

function getBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

export const authAdmin = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401);
    throw new Error("No token provided. Access denied.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "admin") {
    res.status(403);
    throw new Error("Access forbidden. Admins only.");
  }

  const admin = await User.findOne({ _id: decoded.id, role: "admin" }).select("-passwordHash -refreshToken");
  if (!admin) {
    res.status(401);
    throw new Error("Invalid or expired token.");
  }

  req.admin = decoded;
  req.user = admin;
  next();
});

export default authAdmin;
