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
        savedItems: [],
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
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.food")
      .populate("savedItems.food");

    res.status(200).json(cart || { items: [], savedItems: [] });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

/* =========================
   UPDATE QUANTITY (+ / -)
========================= */
export const updateQuantity = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

/* =========================
   REMOVE ITEM FROM CART
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

/* =========================
   SAVE FOR LATER 🔔
========================= */
export const saveForLater = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const [item] = cart.items.splice(itemIndex, 1);
    cart.savedItems.push(item);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Save for later error:", error);
    res.status(500).json({ message: "Failed to save item for later" });
  }
};

/* =========================
   MOVE TO CART 🔄
========================= */
export const moveToCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.savedItems.findIndex(
      (item) => item.food.toString() === foodId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    const [item] = cart.savedItems.splice(itemIndex, 1);
    cart.items.push(item);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Move to cart error:", error);
    res.status(500).json({ message: "Failed to move item to cart" });
  }
};
