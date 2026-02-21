import Order from "../models/Order.js";

/* =========================
   PLACE ORDER (already exists)
========================= */
// unchanged

/* =========================
   GET USER ORDERS
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   CANCEL ORDER (USER)
========================= */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (order.orderStatus === "Delivered")
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET RESTAURANT ORDERS
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.food")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE ORDER STATUS (RESTAURANT)
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // ❌ restaurant cannot update cancelled orders
    if (order.orderStatus === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Cancelled order cannot be updated" });
    }

    // ❌ cannot move backwards
    const flow = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
    if (
      flow.indexOf(status) <
      flow.indexOf(order.orderStatus)
    ) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
