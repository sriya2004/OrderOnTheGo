import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
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
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
      index: true,  // ensures proper indexing
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    savedItems: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model overwrite in dev
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;