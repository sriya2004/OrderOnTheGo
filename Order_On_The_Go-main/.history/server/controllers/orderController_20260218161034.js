import Order from "../models/Order.js";


/* =========================
   PLACE ORDER
========================= */
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentId,
    } = req.body;

    // 🔒 VALIDATIONS
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!deliveryAddress || deliveryAddress.trim() === "") {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // 💳 PAYMENT STATUS
    const paymentStatus =
      paymentMethod === "COD" ? "PENDING" : "PAID";

    // 🆔 UNIQUE ORDER ID (PREVENTS DUPLICATE KEY ERROR)
    const orderId = `ORD-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const order = new Order({
      orderId, // ✅ UNIQUE
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress, // ✅ CONSISTENT FIELD
      paymentMethod,
      paymentStatus,
      paymentId:
        paymentMethod === "ONLINE"
          ? paymentId || "ONLINE_PAID"
          : null,
      orderStatus: "Pending", // ✅ DEFAULT
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

/* =========================
   GET USER ORDERS
========================= */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
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
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};