import { useEffect, useState } from "react";
import API from "../../api/api";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          API.get("/users/profile"),
          API.get("/users/orders")
        ]);
        setProfile(profileRes.data);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="cart-panel">
              <h4 className="section-title">Profile</h4>
              <div className="mt-3">
                <div className="fw-bold">{profile?.name || "User"}</div>
                <div className="food-meta">{profile?.email}</div>
                <div className="food-meta mt-2">{profile?.address}</div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="cart-panel">
              <h4 className="section-title">Order history</h4>
              <div className="d-grid gap-3 mt-3">
                {orders.length === 0 && (
                  <div className="text-muted">No orders yet.</div>
                )}
                {orders.map((order) => (
                  <div key={order._id} className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">Order #{order._id.slice(-6)}</div>
                      <div className="food-meta">{order.items?.length || 0} items</div>
                      <div className="food-meta">{order.deliveryAddress}</div>
                      <div className="food-meta">Payment: {order.paymentMethod}</div>
                    </div>
                    <div className="text-end">
                      <div className="price-tag">₹{order.totalAmount}</div>
                      <div className="food-meta">{order.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
