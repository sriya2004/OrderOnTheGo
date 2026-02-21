import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  addToCart,
  getCart
} from "../controllers/cartController.js";

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

export default router;
