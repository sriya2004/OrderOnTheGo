import { useCallback, useEffect, useState } from "react";
import API from "../../api/api";

const STATUS_FLOW = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

function RestaurantDashboard() {
  const [profile, setProfile] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      const profileRes = await API.get("/restaurants/profile");
      setProfile(profileRes.data);

      const foodRes = await API.get(`/food/restaurant/${profileRes.data._id}`);
      setFoods(foodRes.data || []);

      const orderRes = await API.get("/orders/restaurant");
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, {
        status: nextStatus,
      });
      setMessage("✅ Order status updated");
      loadDashboard();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update order");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Restaurant Management</h2>
      <p className="text-muted mb-4">🏪 {profile?.name}</p>

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h6>Total Menu Items</h6>
            <h2>{foods.length}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h6>Active Orders</h6>
            <h2>{orders.length}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h6>Status</h6>
            <h4 className="text-success">● Active</h4>
          </div>
        </div>
      </div>

      {/* ORDERS */}
      <div className="card p-3">
        <h4 className="mb-3">📦 Live Orders</h4>

        {orders.length === 0 && (
          <p className="text-muted">No orders yet</p>
        )}

        {orders.map((order) => {
          const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);

          return (
            <div key={order._id} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>Order ID:</strong> {order.orderId}
                  <br />
                  <strong>Amount:</strong> ₹{order.totalAmount}
                  <br />
                  <strong>Payment:</strong> {order.paymentMethod}
                </div>

                <span className="badge bg-primary">
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

              {/* ACTION BUTTON */}
              {currentIndex < STATUS_FLOW.length - 1 && (
                <button
                  className="btn btn-outline-primary btn-sm mt-3"
                  onClick={() =>
                    updateOrderStatus(
                      order._id,
                      STATUS_FLOW[currentIndex + 1]
                    )
                  }
                >
                  Move to "{STATUS_FLOW[currentIndex + 1]}"
                </button>
              )}
            </div>
          );
        })}
      </div>

      {message && (
        <p className="text-center mt-3 fw-bold">{message}</p>
      )}
    </div>
  );
}

export default RestaurantDashboard;