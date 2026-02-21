import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import PaymentModule from "../../components/PaymentModule";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cart");
      setCart(res.data || { items: [] });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalAmount = useMemo(() => {
    if (!cart?.items?.length) return 0;

    return cart.items.reduce((sum, item) => {
      if (item?.food?.price) {
        return sum + item.food.price * item.quantity;
      }
      return sum;
    }, 0);
  }, [cart]);

  const finalAmount =
    totalAmount > 0 && totalAmount < 500 ? totalAmount + 50 : totalAmount;

  // ✅ REMOVE ITEM FROM CART
  const removeItem = async (foodId) => {
    try {
      await API.delete(`/cart/remove/${foodId}`);
      await loadCart(); // refresh cart
    } catch (err) {
      setMessage("❌ Failed to remove item from cart");
    }
  };

  const handlePlaceOrder = async () => {
    setMessage("");

    if (!cart?.items?.length) {
      setMessage("❌ Your cart is empty");
      return;
    }

    if (!deliveryAddress.trim()) {
      setMessage("❌ Please enter delivery address");
      return;
    }

    try {
      const orderData = {
        items: cart.items,
        totalAmount: finalAmount,
        address: deliveryAddress,
        paymentMethod: "COD",
      };

      await API.post("/orders", orderData);

      setMessage("✅ Order placed successfully!");
      setDeliveryAddress("");
      await loadCart();
    } catch (err) {
      setMessage(
        "❌ " + (err.response?.data?.message || "Failed to place order")
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Your Cart</h2>
          <Link to="/user" className="pill-btn">Continue Shopping</Link>
        </div>

        <div className="cart-layout">
          {/* LEFT: CART ITEMS */}
          <div className="cart-panel">
            {!cart?.items?.length ? (
              <div className="text-center py-5">
                <h5>Your cart is empty</h5>
                <Link to="/user" className="pill-btn accent mt-3">
                  Browse Menu
                </Link>
              </div>
            ) : (
              cart.items.map(
                (item) =>
                  item.food && (
                    <div
                      key={item.food._id}
                      className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3"
                    >
                      <div>
                        <div className="fw-bold">{item.food.name}</div>
                        <div className="text-muted small">
                          Qty: {item.quantity}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="fw-bold">
                          ₹{item.food.price * item.quantity}
                        </div>

                        {/* ❌ REMOVE BUTTON */}
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeItem(item.food._id)}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  )
              )
            )}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="cart-panel">
            <h5 className="fw-bold mb-3">Summary</h5>

            <div className="price-row">
              <span>Items Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="price-row">
              <span>Delivery Fee</span>
              <span>{totalAmount > 500 ? "FREE" : "₹50"}</span>
            </div>

            <hr />

            <div className="price-row fw-bold">
              <span>Final Bill</span>
              <span>₹{finalAmount}</span>
            </div>

            <div className="mt-3">
              <label className="form-label fw-bold">Delivery Address</label>
              <textarea
                className="form-control"
                rows="3"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>

            <PaymentModule
              totalAmount={finalAmount}
              deliveryAddress={deliveryAddress}
              onPaymentComplete={handlePlaceOrder}
            />

            {message && (
              <div
                className={`mt-3 p-2 text-center ${
                  message.includes("✅")
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;