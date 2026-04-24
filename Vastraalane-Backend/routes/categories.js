import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { authAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", authAdmin, createCategory);
router.put("/:id", authAdmin, updateCategory);
router.delete("/:id", authAdmin, deleteCategory);

export default router;
