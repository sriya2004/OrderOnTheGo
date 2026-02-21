import Food from "../models/Food.js";

/* =========================
   GET ALL FOOD ITEMS
========================= */
export const getAllFood = async (req, res) => {
  try {
    const foodItems = await Food.find().populate("restaurant");
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET FOOD BY RESTAURANT
========================= */
export const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const foodItems = await Food.find({ restaurant: restaurantId });
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
