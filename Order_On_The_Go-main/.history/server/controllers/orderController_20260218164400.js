import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

/* =========================
   PLACE ORDER (USER)
========================= */
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Generate unique readable orderId
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      orderId,                    // 🔥 REQUIRED & UNIQUE
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      orderStatus: "Pending",
      paymentStatus: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
    });

    await order.save();

    // 🔥 Clear cart after successful order
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
}

/* =========================
   GET MY ORDERS (USER)
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

/* =========================
   CANCEL ORDER (USER)
   Only if Pending
========================= */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // only owner can cancel
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled after preparation starts",
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

/* =========================
   GET ALL ORDERS (RESTAURANT)
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* =========================
   UPDATE ORDER STATUS (RESTAURANT)
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowed = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
