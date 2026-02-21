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

// Add to cart
router.post("/", authMiddleware, roleMiddleware("user"), addToCart);

// Get cart
router.get("/", authMiddleware, roleMiddleware("user"), getCart);

// ✅ Update quantity (+ / -)
router.patch(
  "/update/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  updateQuantity
);

// Remove item
router.delete(
  "/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  removeFromCart
);

// Save for later
router.post(
  "/save/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  saveForLater
);

// Move back to cart
router.post(
  "/move/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  moveToCart
);

export default router;
