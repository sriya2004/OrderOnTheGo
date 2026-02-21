import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getUserProfile,
  getUserOrders
} from "../controllers/userController.js";

const router = express.Router();

/* =========================
   USER ROUTES
========================= */

// get user profile
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("user"),
  getUserProfile
);

// get user orders
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("user"),
  getUserOrders
);

export default router;
