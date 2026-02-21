import Food from "../models/Food.js";

/* =========================
   GET ALL FOOD ITEMS (ADMIN / PUBLIC)
========================= */
export const getAllFood = async (req, res) => {
  try {
    const foodItems = await Food.find()
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Get all food error:", error);
    res.status(500).json({ message: "Failed to fetch food items" });
  }
};

/* =========================
   GET FOOD BY RESTAURANT (CUSTOMER)
========================= */
export const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const foodItems = await Food.find({
      restaurant: restaurantId,
      isAvailable: true, // ✅ show only enabled items to customers
    }).sort({ createdAt: -1 });

    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Get food by restaurant error:", error);
    res.status(500).json({ message: "Failed to fetch restaurant menu" });
  }
};

/* =========================
   GET FOOD BY RESTAURANT (RESTAURANT OWNER)
   👉 Used in Restaurant Dashboard & Manage Items
========================= */
export const getMyRestaurantFood = async (req, res) => {
  try {
    const foodItems = await Food.find({
      restaurant: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Get my restaurant food error:", error);
    res.status(500).json({ message: "Failed to fetch your food items" });
  }
};