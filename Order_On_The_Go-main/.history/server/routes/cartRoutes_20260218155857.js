import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
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

// 🔹 Remove item from cart
router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("user"),
  removeFromCart
);

export default router;
