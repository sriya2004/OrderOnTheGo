import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      deliveryAddress, // ✅ FIXED
      paymentMethod,
      paymentId,
    } = req.body;

    // 🔒 VALIDATIONS
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // 💳 PAYMENT STATUS
    const paymentStatus =
      paymentMethod === "COD" ? "PENDING" : "PAID";

    // 🆔 UNIQUE ORDER ID (VERY IMPORTANT)
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      orderId, // ✅ FIXED DUPLICATE ERROR
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress, // ✅ FIXED
      paymentMethod,
      paymentStatus,
      paymentId: paymentMethod === "ONLINE" ? paymentId || "ONLINE_PAID" : null,
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