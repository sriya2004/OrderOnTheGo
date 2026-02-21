import express from "express";
import {
  getAllOrders,
  getOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* USER */
router.post("/", authMiddleware, roleMiddleware("user"), placeOrder);
router.get("/", authMiddleware, roleMiddleware("user"), getOrders);

/* RESTAURANT */
router.get(
  "/restaurant",
  authMiddleware,
  roleMiddleware("restaurant"),
  getAllOrders
);

router.put(
  "/:orderId/status",
  authMiddleware,
  roleMiddleware("restaurant"),
  updateOrderStatus
);

export default router;