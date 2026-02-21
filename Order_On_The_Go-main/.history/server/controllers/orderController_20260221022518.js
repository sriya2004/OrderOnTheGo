import crypto from "crypto";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

/* =========================
   PLACE ORDER (USER)
========================= */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { paymentMethod, deliveryAddress } = req.body;

    if (!paymentMethod || !deliveryAddress) {
      return res.status(400).json({
        message: "Payment method and delivery address are required",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + (item.food.price * item.quantity),
      0
    );

    const orderId = "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const order = await Order.create({
      user: userId,
      items: cart.items.map(item => ({
        food: item.food._id,
        quantity: item.quantity
      })),
      totalAmount,
      paymentMethod,
      deliveryAddress,
      orderId,
      orderStatus: "Pending",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

/* =========================
   GET MY ORDERS (USER)
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to load orders" });
  }
};

/* =========================
   CANCEL ORDER (USER)
========================= */
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

/* =========================
   GET ALL ORDERS (RESTAURANT)
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.food")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to load orders" });
  }
};

/* =========================
   UPDATE ORDER STATUS (RESTAURANT) ✅ FIXED 400 ERROR
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    // FIX: Check for both 'status' and 'orderStatus' to prevent 400 errors
    const status = req.body.status || req.body.orderStatus;

    const allowed = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Received: ${status}. Allowed: ${allowed.join(", ")}` 
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};