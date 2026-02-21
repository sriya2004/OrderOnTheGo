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
      unique: true, // ✅ one cart per user
    },

    // 🛒 ACTIVE CART ITEMS
    items: {
      type: [cartItemSchema],
      default: [],
    },

    // 🔔 SAVE FOR LATER ITEMS
    savedItems: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* 
❌ REMOVED duplicate index to avoid warning
cartSchema.index({ user: 1 });
*/

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
