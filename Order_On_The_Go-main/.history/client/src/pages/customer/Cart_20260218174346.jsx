import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import PaymentModule from "../../components/PaymentModule";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");

  /* =========================
     LOAD CART
  ========================= */
  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cart");
      setCart(res.data?.items ? res.data : { items: [] });
    } catch (err) {
      console.error("Load cart error:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  /* =========================
     UPDATE QUANTITY (+ / -)
     ✅ MATCHES BACKEND
     PUT /cart/update
  ========================= */
  const updateQuantity = async (foodId, action) => {
    try {
      await API.put("/cart/update", {
        foodId,
        action, // "increase" | "decrease"
      });
      loadCart();
    } catch (err) {
      console.error("Update quantity error:", err);
      setMessage("❌ Failed to update quantity");
    }
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeItem = async (foodId) => {
    try {
      await API.delete(`/cart/${foodId}`);
      loadCart();
    } catch (err) {
      console.error("Remove item error:", err);
      setMessage("❌ Failed to remove item");
    }
  };

  /* =========================
     TOTALS
  ========================= */
  const totalAmount = useMemo(() => {
    return cart.items.reduce(
      (sum, item) =>
        item.food ? sum + item.food.price * item.quantity : sum,
      0
    );
  }, [cart]);

  const finalAmount =
    totalAmount > 0 && totalAmount < 500 ? totalAmount + 50 : totalAmount;

  /* =========================
     PLACE ORDER
  ========================= */
  const handlePlaceOrder = async (paymentMethod) => {
    setMessage("");

    if (!cart.items.length) {
      setMessage("❌ Your cart is empty");
      return;
    }

    if (!deliveryAddress.trim()) {
      setMessage("❌ Please enter delivery address");
      return;
    }

    try {
      await API.post("/orders", {
        items: cart.items,
        totalAmount: finalAmount,
        deliveryAddress,
        paymentMethod,
      });

      setMessage("✅ Order placed successfully!");
      setCart({ items: [] });
      setDeliveryAddress("");
    } catch (err) {
      console.error("Place order error:", err);
      setMessage("❌ Failed to place order");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h3>Your Cart</h3>
        <Link to="/user" className="pill-btn">
          Continue Shopping
        </Link>
      </div>

      <div className="row">
        {/* LEFT */}
        <div className="col-md-7">
          {!cart.items.length ? (
            <p className="text-muted">Your cart is empty</p>
          ) : (
            cart.items.map(
              (item) =>
                item.food && (
                  <div
                    key={item.food._id}
                    className="border rounded p-3 mb-3"
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{item.food.name}</strong>
                      <strong>
                        ₹{item.food.price * item.quantity}
                      </strong>
                    </div>

                    {/* QUANTITY CONTROLS */}
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(item.food._id, "decrease")
                        }
                      >
                        −
                      </button>

                      <span className="fw-bold">{item.quantity}</span>

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(item.food._id, "increase")
                        }
                      >
                        +
                      </button>

                      <button
                        className="btn btn-link text-danger ms-3 p-0"
                        onClick={() => removeItem(item.food._id)}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                )
            )
          )}
        </div>

        {/* RIGHT */}
        <div className="col-md-5">
          <div className="border rounded p-3">
            <h5>Summary</h5>

            <div className="d-flex justify-content-between">
              <span>Items Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Delivery Fee</span>
              <span>{totalAmount > 500 ? "FREE" : "₹50"}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Final Bill</span>
              <span>₹{finalAmount}</span>
            </div>

            <textarea
              className="form-control mt-3"
              rows="3"
              placeholder="Delivery Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />

            <PaymentModule
              totalAmount={finalAmount}
              deliveryAddress={deliveryAddress}
              onPaymentComplete={handlePlaceOrder}
            />

            {message && (
              <div
                className={`mt-2 text-center ${
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
