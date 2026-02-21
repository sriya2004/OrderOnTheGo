import { useEffect, useState, useCallback } from "react";
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

  const loadDashboard = useCallback(async () => {
    try {
      const profileRes = await API.get("/restaurants/profile");
      setProfile(profileRes.data);
      const foodRes = await API.get(`/food/restaurant/${profileRes.data._id}`);
      setFoods(foodRes.data || []);
      const ordersRes = await API.get("/restaurants/orders");
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { 
    loadDashboard(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setName(""); setDescription(""); setImage(""); setPrice(""); setEditingId(null);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-shell">
      <div className="container">
        {/* Header Area */}
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div>
            <h2 className="section-title mb-1">Restaurant Management</h2>
            <p className="text-muted fw-bold" style={{ color: "var(--brand-blue) !important" }}>
               🏪 {profile?.name || "Loading..."}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Total Menu Items</h6>
              <div className="display-5 fw-bold text-indigo">{foods.length}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Pending Orders</h6>
              <div className="display-5 fw-bold text-indigo">{orders.length}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-panel text-center">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Store Status</h6>
              <div className="text-success fw-bold fs-4 mt-2">● Active</div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Add/Edit Product Form */}
          <div className="col-lg-5">
            <div className="dashboard-panel shadow-sm">
              <h5 className="fw-bold mb-4">{editingId ? "✏️ Edit Item" : "➕ Add New Item"}</h5>
              <div className="row g-3">
                <div className="col-12">
                  <input className="form-control custom-input" placeholder="Dish Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-12">
                  <input className="form-control custom-input" placeholder="Image URL (e.g., https://...)" value={image} onChange={(e) => setImage(e.target.value)} />
                  {image && (
                    <div className="mt-2 text-center">
                      <img
                        src={image}
                        alt="Preview"
                        className="form-image-preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <textarea className="form-control custom-input" rows="3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="col-6">
                  <select className="form-select custom-input">
                    <option>Veg</option><option>Non Veg</option>
                  </select>
                </div>
                <div className="col-6">
                  <input className="form-control custom-input" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>
              <div className="d-grid gap-2 mt-4">
                <button className="pill-btn accent" onClick={addFood}>
                  {editingId ? "Update Item" : "Save Item"}
                </button>
                {editingId && <button className="btn btn-link text-muted" onClick={() => setEditingId(null)}>Cancel</button>}
              </div>
              {message && <p className="small text-center mt-3">{message}</p>}
            </div>
          </div>

          {/* Menu Items Table */}
          <div className="col-lg-7">
            <div className="dashboard-panel">
              <h5 className="fw-bold mb-4">Current Menu</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food) => (
                      <tr key={food._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {food.image && (
                              <img
                                src={food.image}
                                alt={food.name}
                                className="menu-item-thumb"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <div>
                              <div className="fw-bold">{food.name}</div>
                              <div className="small text-muted text-truncate" style={{maxWidth: "200px"}}>{food.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="fw-bold text-indigo">₹{food.price}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => startEdit(food)}>Edit</button>
                        </td>
                      </tr>
                    ))}
                    {foods.length === 0 && <tr><td colSpan="3" className="text-center py-4">No items in menu yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;