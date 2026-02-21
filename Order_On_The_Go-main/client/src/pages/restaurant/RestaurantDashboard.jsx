import { useCallback, useEffect, useState } from "react";
import API from "../../api/api";

function RestaurantDashboard() {
  const [profile, setProfile] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);

  /* =========================
     LOAD DASHBOARD
  ========================= */
  const loadDashboard = useCallback(async () => {
    try {
      const profileRes = await API.get("/restaurants/profile");
      setProfile(profileRes.data);

      const foodRes = await API.get(
        `/food/restaurant/${profileRes.data._id}`
      );
      setFoods(foodRes.data || []);

      const ordersRes = await API.get("/orders/restaurant");
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* =========================
     COUNTS
  ========================= */
  const foodsCount = foods.length;
  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== "Delivered"
  ).length;

  return (
    <div className="admin-shell">
      <div className="container">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="section-title mb-1">Restaurant Dashboard</h2>
          <p className="text-muted fw-bold">
            🏪 {profile?.name || "Loading..."}
          </p>
        </div>

        {/* STATS */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="dashboard-panel text-center shadow-sm">
              <h6 className="text-muted">Total Menu Items</h6>
              <h2 className="fw-bold text-primary">{foodsCount}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center shadow-sm">
              <h6 className="text-muted">Active Orders</h6>
              <h2 className="fw-bold text-warning">
                {activeOrdersCount}
              </h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center shadow-sm">
              <h6 className="text-muted">Store Status</h6>
              <span className="text-success fw-bold fs-5">
                ● Active
              </span>
            </div>
          </div>
        </div>

        {/* ================= MENU ITEMS ================= */}
        <div className="dashboard-panel shadow-sm">
          <h5 className="fw-bold mb-4">🍽️ Menu Items</h5>

          {foods.length === 0 ? (
            <p className="text-muted">No items added yet.</p>
          ) : (
            foods.map((food) => (
              <div
                key={food._id}
                className="d-flex justify-content-between align-items-center border rounded p-3 mb-3 bg-light"
              >
                <div>
                  <div className="fw-bold text-dark">
                    {food.name}
                  </div>
                  <div className="text-muted small">
                    ₹{food.price}
                  </div>
                </div>

                {/* Optional badge */}
                <span className="badge bg-success-subtle text-success">
                  Available
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default RestaurantDashboard;
