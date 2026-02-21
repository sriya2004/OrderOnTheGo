import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔑 UNIQUE ORDER ID (VERY IMPORTANT)
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true, // ✅ ensures fast lookup & prevents duplicate issues
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ✅ MUST MATCH CONTROLLER & FRONTEND
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ COD / ONLINE
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    // ✅ Payment tracking
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    // ✅ Razorpay payment id (only for ONLINE)
    paymentId: {
      type: String,
      default: null,
    },

    // ✅ Order lifecycle (USED BY RESTAURANT & CUSTOMER)
  orderStatus: {
  type: String,
  enum: [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled" // ✅ REQUIRED
  ],
  default: "Pending",
}
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;