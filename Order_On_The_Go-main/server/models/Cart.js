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
  { _id: false } // Prevents Mongoose from creating sub-IDs for every item
);

/* =========================================
   MAIN CART SCHEMA
========================================= */
const cartSchema = new mongoose.Schema(
  {
    // FIX: Field is named 'user' to match controllers
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // This is the ONLY index definition needed
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
   CLEANUP: REMOVED DUPLICATE INDEX
   (The manual index was causing the console warning)
========================================= */

/* =========================================
   MODEL EXPORT
========================================= */
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;