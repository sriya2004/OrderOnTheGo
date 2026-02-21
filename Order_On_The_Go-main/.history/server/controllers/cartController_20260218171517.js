import Cart from "../models/Cart.js";

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

    if (!foodId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: "Food ID and valid quantity required",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ food: foodId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.food.toString() === foodId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ food: foodId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

/* =========================
   GET USER CART
========================= */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.food");

    // 🔥 ALWAYS return same shape
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

/* =========================
   REMOVE ITEM FROM CART ✅ FIXED
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    // 🔥 If cart already gone, return empty cart (NOT error)
    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    cart.items = cart.items.filter((item) => {
      const itemFoodId =
        typeof item.food === "object"
          ? item.food._id.toString()
          : item.food.toString();

      return itemFoodId !== foodId;
    });

    // 🔥 If no items left → delete cart
    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ user: req.user.id });
      return res.status(200).json({ items: [] });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};
