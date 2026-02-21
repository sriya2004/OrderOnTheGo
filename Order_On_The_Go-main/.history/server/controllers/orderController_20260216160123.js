import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    const paymentStatus =
      paymentMethod === "COD" ? "PENDING" : "PAID";

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentStatus,
      paymentId: paymentMethod === "ONLINE" ? paymentId : null,
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