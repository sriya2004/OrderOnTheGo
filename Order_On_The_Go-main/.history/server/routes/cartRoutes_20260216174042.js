export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ FIX: handle both populated & non-populated food
    cart.items = cart.items.filter(
      (item) =>
        item.food.toString() !== foodId &&
        item.food._id?.toString() !== foodId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};