import Food from "../models/Food.js";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

/* =========================
   GET RESTAURANT PROFILE
========================= */
export const getRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id).select("-password");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Get restaurant profile error:", error);
    res.status(500).json({ message: "Failed to load restaurant profile" });
  }
};

/* =========================
   GET RESTAURANT FOODS
========================= */
export const getRestaurantFoods = async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    console.error("Get restaurant foods error:", error);
    res.status(500).json({ message: "Failed to load menu items" });
  }
};

/* =========================
   ADD FOOD ITEM
========================= */
export const addFoodItem = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Food name and price are required",
      });
    }

    const food = await Food.create({
      name: name.trim(),
      description: description || "",
      price,
      image: image || "",
      restaurant: req.user.id,
      isAvailable: true,
    });

    res.status(201).json({
      message: "Food item added successfully",
      food,
    });
  } catch (error) {
    console.error("Add food error:", error);
    res.status(500).json({ message: "Failed to add food item" });
  }
};

/* =========================
   UPDATE FOOD ITEM
========================= */
export const updateFoodItem = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findOne({
      _id: foodId,
      restaurant: req.user.id, // 🔐 ownership check
    });

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const { name, description, price, image } = req.body;

    if (name !== undefined) food.name = name.trim();
    if (description !== undefined) food.description = description;
    if (price !== undefined) food.price = price;
    if (image !== undefined) food.image = image;

    await food.save();

    res.status(200).json({
      message: "Food item updated successfully",
      food,
    });
  } catch (error) {
    console.error("Update food error:", error);
    res.status(500).json({ message: "Failed to update food item" });
  }
};

/* =========================
   DELETE FOOD ITEM ❌
========================= */
export const deleteFoodItem = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findOneAndDelete({
      _id: foodId,
      restaurant: req.user.id,
    });

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.error("Delete food error:", error);
    res.status(500).json({ message: "Failed to delete food item" });
  }
};

/* =========================
   ENABLE / DISABLE FOOD ITEM
========================= */
export const toggleFoodAvailability = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findOne({
      _id: foodId,
      restaurant: req.user.id,
    });

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.status(200).json({
      message: `Food item ${food.isAvailable ? "enabled" : "disabled"}`,
      food,
    });
  } catch (error) {
    console.error("Toggle food availability error:", error);
    res.status(500).json({ message: "Failed to update food status" });
  }
};

/* =========================
   GET RESTAURANT ORDERS
========================= */
export const getRestaurantOrders = async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.user.id,
    }).select("_id");

    const foodIds = foods.map((f) => f._id);

    const orders = await Order.find({
      "items.food": { $in: foodIds },
    })
      .populate("items.food")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get restaurant orders error:", error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};
