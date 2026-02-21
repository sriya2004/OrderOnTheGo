import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getRestaurantProfile,
  addFoodItem,
  updateFoodItem,
  getRestaurantOrders
} from "../controllers/restaurantController.js";

const router = express.Router();

/* =========================
   RESTAURANT ROUTES
========================= */

// get restaurant profile
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("restaurant"),
  getRestaurantProfile
);

// add food item
router.post(
  "/food",
  authMiddleware,
  roleMiddleware("restaurant"),
  addFoodItem
);

// update food item
router.put(
  "/food/:id",
  authMiddleware,
  roleMiddleware("restaurant"),
  updateFoodItem
);

// get restaurant orders
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("restaurant"),
  getRestaurantOrders
);

export default router;
