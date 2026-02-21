import Cart from "../models/Cart.js";

/* =========================
   HELPER: GET USER ID SAFELY
========================= */
const getUserId = (req) => {
  // Use optional chaining to prevent crashes if req.user is missing
  return req.user?._id || req.user?.id || req.user?.userId;
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { foodId, quantity } = req.body;

    if (!foodId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Food ID and valid quantity required" });
    }

    // FIX: Using 'user' instead of 'userId' to match Mongoose Schema
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId, // Match your schema field name here
        items: [{ food: foodId, quantity: Number(quantity) }],
        savedItems: [],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.food.toString() === foodId.toString()
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({ food: foodId, quantity: Number(quantity) });
      }
      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.food")
      .populate("savedItems.food");

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("🔥 Add to cart error:", error);
    res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
};

/* =========================
   GET USER CART
========================= */
export const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const cart = await Cart.findOne({ user: userId }) // Fixed field name
      .populate("items.food")
      .populate("savedItems.food");

    res.status(200).json(cart || { items: [], savedItems: [] });
  } catch (error) {
    console.error("🔥 Get cart error:", error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

/* =========================
   UPDATE QUANTITY
========================= */
export const updateQuantity = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { foodId } = req.params;
    const { type } = req.body;

    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const cart = await Cart.findOne({ user: userId }); // Fixed field name
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.food.toString() === foodId.toString());
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (type === "increase") item.quantity += 1;
    else if (type === "decrease") item.quantity -= 1;
    else return res.status(400).json({ message: "Invalid update type" });

    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.food.toString() !== foodId.toString());
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.food").populate("savedItems.food");
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

/* =========================
   REMOVE ITEM
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { foodId } = req.params;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const cart = await Cart.findOne({ user: userId }); // Fixed field name
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.food.toString() !== foodId.toString());
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.food").populate("savedItems.food");
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

/* =========================
   SAVE FOR LATER
========================= */
export const saveForLater = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: userId }); // Fixed field name
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex((item) => item.food.toString() === foodId.toString());
    if (index === -1) return res.status(404).json({ message: "Item not found" });

    const [item] = cart.items.splice(index, 1);
    cart.savedItems.push(item);

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.food").populate("savedItems.food");
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to save item" });
  }
};

/* =========================
   MOVE TO CART
========================= */
export const moveToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: userId }); // Fixed field name
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.savedItems.findIndex((item) => item.food.toString() === foodId.toString());
    if (index === -1) return res.status(404).json({ message: "Item not found" });

    const [item] = cart.savedItems.splice(index, 1);
    const existingItem = cart.items.find((i) => i.food.toString() === foodId.toString());

    if (existingItem) existingItem.quantity += item.quantity;
    else cart.items.push(item);

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.food").populate("savedItems.food");
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to move item" });
  }
};