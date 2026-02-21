import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("user"), addToCart);
router.get("/", authMiddleware, roleMiddleware("user"), getCart);

// ✅ THIS ROUTE MUST EXIST
router.delete(
  "/:foodId",
  authMiddleware,
  roleMiddleware("user"),
  removeFromCart
);

export default router;