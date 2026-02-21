import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Food from "../models/Food.js";

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET ALL RESTAURANTS
========================= */
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select("-password");
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   APPROVE RESTAURANT
========================= */
export const approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.approved = true;
    await restaurant.save();

    res.status(200).json({
      message: "Restaurant approved successfully",
      restaurant
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET ALL ORDERS
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET ALL FOODS (PRODUCTS)
========================= */
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("restaurant")
      .sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
