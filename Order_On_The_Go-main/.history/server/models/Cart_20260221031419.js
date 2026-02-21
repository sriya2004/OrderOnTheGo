import mongoose from "mongoose";

/* =========================================
   CART ITEM SUBSCHEMA
========================================= */
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

/* =========================================
   MAIN CART SCHEMA
========================================= */
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ensures one cart per user
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

/* =========================================
   ENSURE INDEX (CLEAN WAY)
========================================= */
cartSchema.index({ user: 1 }, { unique: true });

/* =========================================
   MODEL EXPORT
========================================= */
const Cart =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;