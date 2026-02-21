import { useCallback, useEffect, useState } from "react";
import API from "../../api/api";

function RestaurantDashboard() {
  const [profile, setProfile] = useState(null);
  const [foodsCount, setFoodsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  const loadDashboard = useCallback(async () => {
    try {
      const profileRes = await API.get("/restaurants/profile");
      setProfile(profileRes.data);

      const foodRes = await API.get(
        `/food/restaurant/${profileRes.data._id}`
      );
      setFoodsCount(foodRes.data.length);

      const ordersRes = await API.get("/orders/restaurant");
      const activeOrders = ordersRes.data.filter(
        (o) => o.orderStatus !== "Delivered"
      );
      setOrdersCount(activeOrders.length);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="admin-shell">
      <div className="container">
        <h2 className="section-title mb-1">Restaurant Dashboard</h2>
        <p className="text-muted fw-bold">
          🏪 {profile?.name || "Loading..."}
        </p>

        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6>Total Menu Items</h6>
              <h2>{foodsCount}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6>Active Orders</h6>
              <h2>{ordersCount}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6>Store Status</h6>
              <span className="text-success fw-bold">● Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
