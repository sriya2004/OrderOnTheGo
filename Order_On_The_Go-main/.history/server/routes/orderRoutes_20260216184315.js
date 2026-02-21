import express from "express";
import {
  getOrders,
  placeOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Place order
router.post("/", authMiddleware, roleMiddleware("user"), placeOrder);

// Get user orders
router.get("/", authMiddleware, roleMiddleware("user"), getOrders);

export default router; // ✅ THIS IS CRITICAL