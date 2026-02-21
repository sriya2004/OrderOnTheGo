import { useEffect, useState } from "react";
import API from "../../api/api";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get("/orders/restaurant").then(res => setOrders(res.data));
  }, []);

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">📦 Orders</h3>

      {orders.map(order => (
        <div
          key={order._id}
          className="dashboard-panel mb-3 cursor-pointer"
          onClick={() => setSelected(order)}
        >
          <div className="fw-bold">Order #{order.orderId}</div>
          <small>{order.orderStatus}</small>
        </div>
      ))}

      {/* MODAL */}
      {selected && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h5>Order Details</h5>
            <p>Status: {selected.orderStatus}</p>

            {selected.items.map(i => (
              <div key={i._id}>
                {i.food.name} × {i.quantity}
              </div>
            ))}

            <button className="btn btn-secondary mt-3" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
