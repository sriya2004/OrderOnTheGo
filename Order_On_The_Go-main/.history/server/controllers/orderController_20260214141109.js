import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

/* =========================
   PLACE ORDER
========================= */
/* =========================
   PLACE ORDER (FIXED)
========================= */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deliveryAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // FIX: Add defensive check inside the loop
    cart.items.forEach((item) => {
      // Check if food exists and hasn't been deleted from the DB
      if (item.food && item.food.price) {
        totalAmount += item.food.price * item.quantity;
        
        orderItems.push({
          food: item.food._id,
          quantity: item.quantity
        });
      }
    });

    // Final check: if after filtering, no valid items remain
    if (orderItems.length === 0) {
      return res.status(400).json({ message: "Items in your cart are no longer available" });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod
    });

    // clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.log("SERVER ERROR:", error.message); // This helps you debug in the terminal
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET USER ORDERS
========================= */
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
