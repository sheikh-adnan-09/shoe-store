import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  verifyCashOnDeliveryPayment,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.get("/", admin, getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", admin, updateOrderStatus);
router.put("/:id/verify-cod-payment", admin, verifyCashOnDeliveryPayment);

export default router;
