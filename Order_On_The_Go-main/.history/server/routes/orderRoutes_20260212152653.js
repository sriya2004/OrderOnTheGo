import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  placeOrder,
  getOrders
} from "../controllers/orderController.js";

const router = express.Router();

/* =========================
   ORDER ROUTES (USER)
========================= */

// place order
router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  placeOrder
);

// get user orders
router.get(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  getOrders
);

export default router;
