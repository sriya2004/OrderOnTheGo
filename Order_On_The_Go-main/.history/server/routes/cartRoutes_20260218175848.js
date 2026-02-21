import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity, // ✅ ADD
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// add to cart
router.post("/", authMiddleware, roleMiddleware("user"), addToCart);

// get cart
router.get("/", authMiddleware, roleMiddleware("user"), getCart);

// 🔥 FIX: UPDATE QUANTITY (+ / -)
router.patch(
  "/update/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  updateQuantity
);

// remove item (DO NOT TOUCH)
router.delete(
  "/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  removeFromCart
);

export default router;
