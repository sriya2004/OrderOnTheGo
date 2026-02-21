import express from "express";
import {
  addToCart,
  getCart,
  moveToCart,
  removeFromCart,
  saveForLater,
  updateQuantity,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* =========================
   CART ROUTES (USER)
========================= */

// 🔹 Add item to cart
router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  addToCart
);

// 🔹 Get user cart
router.get(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  getCart
);

// 🔹 Update quantity (+ / -)
router.put(
  "/update",
  authMiddleware,
  roleMiddleware("user"),
  updateQuantity
);

// 🔹 Remove item from cart
router.delete(
  "/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  removeFromCart
);

// 🔔 Save for later
router.post(
  "/save/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  saveForLater
);

// 🔄 Move item back to cart
router.post(
  "/move/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  moveToCart
);

export default router;
