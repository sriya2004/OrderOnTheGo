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

  // Defensive useMemo to prevent "Cannot read properties of null"
  const totalAmount = useMemo(() => {
    if (!cart?.items || cart.items.length === 0) return 0;

    return cart.items.reduce((sum, item) => {
      // Defensive Check: Ensure item and food object exist
      if (item && item.food && item.food.price) {
        return sum + (item.food.price * item.quantity);
      }
      return sum;
    }, 0);
  }, [cart]);

  const finalAmount = totalAmount + (totalAmount > 0 && totalAmount < 500 ? 50 : 0);

 const handlePlaceOrder = async (paymentMethod) => {
  setMessage("");
  try {
    // Construct the full order object
    const orderData = {
      items: cart.items, // Pass the items currently in the cart
      totalAmount: finalAmount, // Pass the calculated total
      deliveryAddress,
      paymentMethod
    };

    console.log("Sending Order Data:", orderData); // Debugging line

    await API.post("/orders", orderData);
    
    setMessage("✅ Order placed successfully! Your delicious food is on the way.");
    setDeliveryAddress("");
    await loadCart();
  } catch (err) {
    // More detailed error logging
    console.error("Order Error Details:", err.response?.data);
    setMessage("❌ " + (err.response?.data?.message || "Failed to place order"));
  }
};

  if (loading) {
    return (
      <div className="admin-shell d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted fw-bold">Loading your delicious items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Your Cart</h2>
          <Link to="/user" className="pill-btn">Continue Shopping</Link>
        </div>

        <div className="cart-layout">
          {/* Left Side: Items List */}
          <div className="cart-panel">
            {!cart?.items?.length ? (
              <div className="text-center py-5">
                <div className="display-1 text-muted opacity-25 mb-3">🛒</div>
                <h5>Your cart is empty</h5>
                <Link to="/user" className="pill-btn accent mt-3">Browse Menu</Link>
              </div>
            ) : (
              <div className="d-grid gap-4">
                {cart.items.map((item) => (
                  item.food && (
                    <div key={item.food._id} className="d-flex align-items-center justify-content-between gap-3 border-bottom pb-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.food.image || "https://via.placeholder.com/80"}
                          alt={item.food.name}
                          className="cart-item-thumb shadow-sm"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }}
                        />
                        <div>
                          <div className="fw-bold fs-5">{item.food.name}</div>
                          <div className="small text-muted">{item.food.restaurant?.name}</div>
                          <div className="badge bg-light text-dark border mt-1">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="price-tag fs-5">₹{item.food.price * item.quantity}</div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Bill Details & Checkout */}
          <div className="cart-panel">
            <h5 className="fw-bold mb-4">Summary</h5>
            <div className="price-row">
              <span>Items Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="price-row">
              <span>Delivery Fee</span>
              <span className={totalAmount > 500 ? "text-success fw-bold" : ""}>
                {totalAmount > 500 ? "FREE" : `₹${totalAmount > 0 ? 50 : 0}`}
              </span>
            </div>
            <hr className="my-3" style={{ borderTop: '2px dashed #e2e8f0' }} />
            <div className="price-row mb-4">
              <strong className="fs-5">Final Bill</strong>
              <strong className="fs-5 text-indigo">
                ₹{finalAmount}
              </strong>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase">Delivery Address</label>
              <textarea
                className="form-control custom-input"
                rows="3"
                placeholder="Flat No, Building Name, Street, Landmark..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>

            {/* Payment Module */}
            <PaymentModule
              totalAmount={finalAmount}
              onPaymentComplete={handlePlaceOrder}
              deliveryAddress={deliveryAddress}
            />
            
            {message && (
              <div className={`mt-3 p-3 rounded text-center animate-fadeIn ${message.includes('✅') ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
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