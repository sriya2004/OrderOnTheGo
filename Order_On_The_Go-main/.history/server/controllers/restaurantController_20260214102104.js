import Restaurant from "../models/Restaurant.js";
import Food from "../models/Food.js";
import Order from "../models/Order.js";

/* =========================
   GET RESTAURANT PROFILE
========================= */
export const getRestaurantProfile = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const restaurant = await Restaurant.findById(restaurantId).select("-password");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   ADD FOOD ITEM
========================= */
export const addFoodItem = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const { name, description, price, image } = req.body;

    const food = await Food.create({
      name,
      description,
      price,
      image,
      restaurant: restaurantId
    });

    res.status(201).json({
      message: "Food item added successfully",
      food
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   UPDATE FOOD ITEM
========================= */
export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    Object.assign(food, req.body);
    await food.save();

    res.status(200).json({
      message: "Food item updated successfully",
      food
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET RESTAURANT ORDERS
========================= */
export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const foods = await Food.find({ restaurant: restaurantId }).select("_id");
    const foodIds = foods.map((food) => food._id);

    const orders = await Order.find({
      "items.food": { $in: foodIds }
    })
      .populate("items.food")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
