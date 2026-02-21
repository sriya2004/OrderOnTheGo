import { useEffect, useState } from "react";
import API from "../../api/api";

const STATUS_FLOW = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data || []);
  };

  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 10000); // auto refresh
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">📦 My Orders</h3>

      {orders.length === 0 && (
        <p className="text-muted">No orders placed yet</p>
      )}

      {orders.map((order) => {
        const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);

        return (
          <div key={order._id} className="card p-3 mb-3">
            <div className="d-flex justify-content-between">
              <div>
                <strong>Order ID:</strong> {order.orderId}
                <br />
                <strong>Amount:</strong> ₹{order.totalAmount}
              </div>
              <span className="badge bg-info">
                {order.orderStatus}
              </span>
            </div>

            {/* TIMELINE */}
            <div className="d-flex gap-3 mt-3">
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
          </div>
        );
      })}
    </div>
  );
}

export default MyOrders;