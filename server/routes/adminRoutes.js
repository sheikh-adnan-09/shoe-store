import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  updateUserRole,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, admin);
router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);
router.put("/users/:id/role", updateUserRole);

export default router;
