import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

function setAuthCookies(res, accessToken, refreshToken) {
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("accessToken", accessToken, { ...baseOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...baseOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // Admin can only be created via seed script.
  const user = await User.create({ name, email, passwordHash, role: "user" });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    user: sanitizeUser(user),
    tokens: { accessToken, refreshToken },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const adminToken =
    user.role === "admin"
      ? jwt.sign(
          { id: user._id, email: user.email, role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        )
      : null;
  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res.json({
    success: true,
    user: sanitizeUser(user),
    tokens: { accessToken, refreshToken, adminToken },
  });
});

export const refreshSession = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("Refresh token missing");
  }

  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.userId);

  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken(user._id);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.json({ success: true, accessToken });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = "";
      await user.save();
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  res.json({
    success: true,
    message: user
      ? "Password reset flow not wired to email provider yet. Add SMTP env values to enable it."
      : "If the account exists, a reset link will be sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: `Reset password endpoint is available. Wire token persistence before using /reset-password/${req.params.token} in production.`,
  });
});
