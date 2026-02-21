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

// add to cart
router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  addToCart
);

// get cart
router.get(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  getCart
);

// ✅ REMOVE ITEM FROM CART
router.delete(
  "/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  removeFromCart
);

export default router;