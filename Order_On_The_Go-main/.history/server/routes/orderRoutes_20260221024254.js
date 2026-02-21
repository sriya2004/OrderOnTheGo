import express from "express";
import {
  cancelOrder,
  getAllOrders,
  getMyOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* =========================
   USER ROUTES
========================= */

// Place order
router.post("/", authMiddleware, roleMiddleware("user"), placeOrder);

// Get logged-in user's orders
router.get("/my", authMiddleware, roleMiddleware("user"), getMyOrders);

// Cancel order (user)
router.put(
  "/cancel/:id",
  authMiddleware,
  roleMiddleware("user"),
  cancelOrder
);

/* =========================
   RESTAURANT ROUTES
========================= */

// Get restaurant orders
router.get(
  "/restaurant",
  authMiddleware,
  roleMiddleware("restaurant"),
  getAllOrders
);

// Update order status
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("restaurant"),
  updateOrderStatus
);

export default router;