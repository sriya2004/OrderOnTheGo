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

/* USER ROUTES */
router.post("/", authMiddleware, roleMiddleware("user"), placeOrder);
router.get("/my", authMiddleware, roleMiddleware("user"), getMyOrders);
router.put("/cancel/:id", authMiddleware, roleMiddleware("user"), cancelOrder);

/* RESTAURANT ROUTES */
router.get(
  "/restaurant",
  authMiddleware,
  roleMiddleware("restaurant"),
  getAllOrders
);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("restaurant"),
  updateOrderStatus
);

export default router; // 🔥 THIS FIXES THE ERROR
