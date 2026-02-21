import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  addFoodItem,
  deleteFoodItem,
  getRestaurantFoods,
  getRestaurantOrders,
  getRestaurantProfile,
  toggleFoodAvailability,
  updateFoodItem,
} from "../controllers/restaurantController.js";

const router = express.Router();

/* =========================
   RESTAURANT PROFILE
========================= */

// 🔹 Get logged-in restaurant profile
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("restaurant"),
  getRestaurantProfile
);

/* =========================
   FOOD / MENU MANAGEMENT
========================= */

// 🔹 Get all foods of this restaurant
router.get(
  "/foods",
  authMiddleware,
  roleMiddleware("restaurant"),
  getRestaurantFoods
);

// 🔹 Add new food item
router.post(
  "/foods",
  authMiddleware,
  roleMiddleware("restaurant"),
  addFoodItem
);

// 🔹 Update food item
router.put(
  "/foods/:foodId",
  authMiddleware,
  roleMiddleware("restaurant"),
  updateFoodItem
);

// 🔹 Enable / Disable food item
router.patch(
  "/foods/:foodId/toggle",
  authMiddleware,
  roleMiddleware("restaurant"),
  toggleFoodAvailability
);

// 🔥 DELETE food item
router.delete(
  "/foods/:foodId",
  authMiddleware,
  roleMiddleware("restaurant"),
  deleteFoodItem
);

/* =========================
   ORDERS MANAGEMENT
========================= */

// 🔹 Get restaurant orders
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("restaurant"),
  getRestaurantOrders
);

export default router;
