import { useEffect, useState } from "react";
import API from "../../api/api";

const STATUS_FLOW = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER ORDERS
  ========================= */
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders/my");
      setOrders(Array.isArray(res.data) ? res.data : []);
      setMessage("");
    } catch (err) {
      console.error("Load orders error:", err);
      setOrders([]);
      setMessage("❌ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 10000); // 🔁 auto refresh
    return () => clearInterval(timer);
  }, []);

  /* =========================
     CANCEL ORDER (PENDING ONLY)
  ========================= */
  const cancelOrder = async (orderId) => {
    try {
      await API.put(`/orders/cancel/${orderId}`);
      setMessage("✅ Order cancelled successfully");
      loadOrders();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Unable to cancel order"
      );
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
      <h3 className="fw-bold mb-4">📦 My Orders</h3>

      {message && (
        <div
          className={`mb-3 ${
            message.includes("✅") ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </div>
      )}

      {orders.length === 0 && !message && (
        <p className="text-muted">No orders placed yet</p>
      )}

      {orders.map((order) => {
        const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);

        return (
          <div key={order._id} className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>Order ID:</strong> {order.orderId}
                <br />
                <strong>Amount:</strong> ₹{order.totalAmount}
              </div>

              <span className="badge bg-info text-dark">
                {order.orderStatus}
              </span>
            </div>

            {/* 🔄 STATUS TIMELINE */}
            <div className="d-flex flex-wrap gap-2 mt-3">
              {STATUS_FLOW.map((s, i) => (
                <div
                  key={s}
                  className={`px-3 py-1 rounded ${
                    i <= currentIndex
                      ? "bg-success text-white"
                      : "bg-light"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* ❌ CANCEL (ONLY IF PENDING) */}
            {order.orderStatus === "Pending" && (
              <button
                className="btn btn-outline-danger btn-sm mt-3"
                onClick={() => cancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MyOrders;
