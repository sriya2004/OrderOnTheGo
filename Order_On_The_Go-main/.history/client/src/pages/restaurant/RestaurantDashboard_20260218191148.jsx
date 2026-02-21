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
     DERIVED COUNTS
  ========================= */
  const foodsCount = foods.length;
  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== "Delivered"
  ).length;

  /* =========================
     EDIT FOOD
  ========================= */
  {foods.map((food) => (
  <div
    key={food._id}
    className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
  >
    <div>
      <div className="fw-bold">{food.name}</div>
      <div className="text-muted small">
        ₹{food.price}
      </div>
    </div>
  </div>
))}


  return (
    <div className="admin-shell">
      <div className="container">
        {/* HEADER */}
        <h2 className="section-title mb-1">Restaurant Dashboard</h2>
        <p className="text-muted fw-bold">
          🏪 {profile?.name || "Loading..."}
        </p>

        {/* STATS */}
        <div className="row g-4 mt-4 mb-5">
          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6>Total Menu Items</h6>
              <h2>{foodsCount}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6>Active Orders</h6>
              <h2>{activeOrdersCount}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6>Store Status</h6>
              <span className="text-success fw-bold">● Active</span>
            </div>
          </div>
        </div>

        {/* ================= MENU ITEMS LIST ================= */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <div className="dashboard-panel">
              <h5 className="fw-bold mb-4">🍽️ Menu Items</h5>

              {foods.length === 0 ? (
                <p className="text-muted">No items added yet.</p>
              ) : (
                foods.map((food) => (
                  <div
                    key={food._id}
                    className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
                  >
                    <div>
                      <div className="fw-bold">{food.name}</div>
                      <div className="text-muted small">
                        ₹{food.price}
                      </div>
                    </div>

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => startEdit(food)}
                    >
                      Edit
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
