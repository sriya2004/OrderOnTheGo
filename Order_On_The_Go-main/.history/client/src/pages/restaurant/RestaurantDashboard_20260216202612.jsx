import { useCallback, useEffect, useState } from "react";
import API from "../../api/api";

function RestaurantDashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  const loadDashboard = useCallback(async () => {
    try {
      const profileRes = await API.get("/restaurants/profile");
      setProfile(profileRes.data);

      const foodRes = await API.get(
        `/food/restaurant/${profileRes.data._id}`
      );
      setFoods(foodRes.data || []);

      // 🔥 RESTAURANT ORDERS
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
     ADD / EDIT FOOD
  ========================= */
  const addFood = async () => {
    try {
      const payload = { name, description, price, image };

      if (editingId) {
        await API.put(`/restaurants/food/${editingId}`, payload);
        setMessage("✅ Food updated successfully");
      } else {
        await API.post("/restaurants/food", payload);
        setMessage("✅ Food added successfully");
      }

      setName("");
      setDescription("");
      setImage("");
      setPrice("");
      setEditingId(null);

      await loadDashboard();
    } catch (err) {
      setMessage("❌ Failed to save food");
      console.log(err);
    }
  };

  const startEdit = (food) => {
    setEditingId(food._id);
    setName(food.name || "");
    setDescription(food.description || "");
    setImage(food.image || "");
    setPrice(food.price || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =========================
     ORDER STATUS UPDATE
  ========================= */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      loadDashboard();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus !== "Delivered"
  ).length;

  return (
    <div className="admin-shell">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div>
            <h2 className="section-title mb-1">
              Restaurant Management
            </h2>
            <p className="text-muted fw-bold">
              🏪 {profile?.name || "Loading..."}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">
                Total Menu Items
              </h6>
              <div className="display-5 fw-bold text-indigo">
                {foods.length}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">
                Active Orders
              </h6>
              <div className="display-5 fw-bold text-indigo">
                {pendingOrdersCount}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">
                Store Status
              </h6>
              <div className="text-success fw-bold fs-4 mt-2">
                ● Active
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* LEFT: ADD / EDIT FOOD */}
          <div className="col-lg-5">
            <div className="dashboard-panel shadow-sm">
              <h5 className="fw-bold mb-4">
                {editingId ? "✏️ Edit Item" : "➕ Add New Item"}
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <input
                    className="form-control custom-input"
                    placeholder="Dish Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <input
                    className="form-control custom-input"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <textarea
                    className="form-control custom-input"
                    rows="3"
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />
                </div>

                <div className="col-6">
                  <input
                    className="form-control custom-input"
                    placeholder="Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button
                  className="pill-btn accent"
                  onClick={addFood}
                >
                  {editingId ? "Update Item" : "Save Item"}
                </button>
              </div>

              {message && (
                <p className="small text-center mt-3">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: ORDERS MANAGEMENT */}
          <div className="col-lg-7">
            <div className="dashboard-panel">
              <h5 className="fw-bold mb-4">
                Manage Orders
              </h5>

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded p-3 mb-3"
                >
                  <div className="fw-bold">
                    Order #{order.orderId}
                  </div>
                  <div className="small text-muted">
                    ₹{order.totalAmount} •{" "}
                    {order.paymentMethod}
                  </div>

                  <select
                    className="form-select mt-2"
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateOrderStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                  </select>
                </div>
              ))}

              {orders.length === 0 && (
                <p className="text-center text-muted">
                  No orders yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;