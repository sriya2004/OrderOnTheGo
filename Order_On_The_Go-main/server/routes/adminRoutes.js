import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  getAllRestaurants,
  approveRestaurant,
  getAllOrders,
  getAllFoods
} from "../controllers/adminController.js";

const router = express.Router();

/* =========================
   ADMIN ROUTES (ADMIN ONLY)
========================= */

// get all users
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

// get all restaurants
router.get(
  "/restaurants",
  authMiddleware,
  roleMiddleware("admin"),
  getAllRestaurants
);

// approve restaurant
router.put(
  "/approve/:id",
  authMiddleware,
  roleMiddleware("admin"),
  approveRestaurant
);

// get all orders
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOrders
);

// get all foods (products)
router.get(
  "/foods",
  authMiddleware,
  roleMiddleware("admin"),
  getAllFoods
);

export default router;
