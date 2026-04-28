import express from "express";
import { changePassword, getMe, updateMe } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/me/password", changePassword);

export default router;
