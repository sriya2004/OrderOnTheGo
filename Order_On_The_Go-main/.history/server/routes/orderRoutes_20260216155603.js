import express from "express";

const router = express.Router();

/* =========================
   ORDER ROUTES (USER)
========================= */

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentStatus,
      paymentId,
    } = req.body;

    // 🔒 Validations
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // 🧠 Payment logic
    const finalPaymentStatus =
      paymentMethod === "COD" ? "PENDING" : "PAID";

    // 🧾 Create order
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
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
