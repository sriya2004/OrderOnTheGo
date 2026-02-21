import Cart from "../models/Cart.js";

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    // FIX: Using req.user._id or req.user.id safely
    const userId = req.user._id || req.user.id;
    const { foodId, quantity } = req.body;

    // Validation
    if (!foodId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: "Food ID and valid quantity required",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = await Cart.create({
        user: userId,
        items: [{ food: foodId, quantity: Number(quantity) }],
        savedItems: [],
      });
    } else {
      // Check if item already exists in items array
      const itemIndex = cart.items.findIndex(
        (item) => item.food.toString() === foodId.toString()
      );

      if (itemIndex > -1) {
        // Increment existing quantity
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Add new item to array
        cart.items.push({ food: foodId, quantity: Number(quantity) });
      }

      await cart.save();
    }

    // Return populated cart so frontend has food details immediately
    const updatedCart = await Cart.findById(cart._id).populate("items.food");
    res.status(200).json(updatedCart);

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
};

/* =========================
   GET USER CART
========================= */
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: userId })
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
    const { foodId } = req.params;
    const { type } = req.body; 
    const userId = req.user._id || req.user.id;

    if (!foodId || !type) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.food.toString() === foodId.toString()
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (type === "increase") {
      item.quantity += 1;
    } 
    else if (type === "decrease") {
      item.quantity -= 1;
    }

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.food.toString() !== foodId.toString()
      );
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.food");
    res.status(200).json(updatedCart);
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
    const userId = req.user._id || req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId.toString()
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

/* =========================
   SAVE FOR LATER
========================= */
export const saveForLater = async (req, res) => {
  try {
    const { foodId } = req.params;
    const userId = req.user._id || req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId.toString()
    );

    if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart" });

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
   MOVE TO CART
========================= */
export const moveToCart = async (req, res) => {
  try {
    const { foodId } = req.params;
    const userId = req.user._id || req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.savedItems.findIndex(
      (item) => item.food.toString() === foodId.toString()
    );

    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    const [item] = cart.savedItems.splice(itemIndex, 1);
    cart.items.push(item);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Move to cart error:", error);
    res.status(500).json({ message: "Failed to move item to cart" });
  }
};