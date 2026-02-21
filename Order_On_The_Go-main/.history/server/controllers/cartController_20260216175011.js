import Cart from "../models/Cart.js";

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

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
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET USER CART
========================= */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.food");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   REMOVE ITEM FROM CART  ✅ NEW
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};