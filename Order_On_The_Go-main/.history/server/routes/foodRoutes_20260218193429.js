import express from "express";
import {
  getAllFood,
  getFoodByRestaurant,
  getMyRestaurantFood,
} from "../controllers/foodController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* =========================
   FOOD ROUTES (PUBLIC)
========================= */

// 🌍 Get all food items (admin / public)
router.get("/", getAllFood);

// 🍽️ Get food by restaurant (customers)
router.get("/restaurant/:restaurantId", getFoodByRestaurant);

/* =========================
   FOOD ROUTES (RESTAURANT)
========================= */

// 🏪 Get logged-in restaurant's own food items
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("restaurant"),
  getMyRestaurantFood
);

export default router;