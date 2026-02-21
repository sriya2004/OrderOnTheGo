import express from "express";
import {
  getAllFood,
  getFoodByRestaurant
} from "../controllers/foodController.js";

const router = express.Router();

/* =========================
   FOOD ROUTES (PUBLIC)
========================= */

// get all food items (for users)
router.get("/", getAllFood);

// get food by restaurant
router.get("/restaurant/:restaurantId", getFoodByRestaurant);

export default router;
