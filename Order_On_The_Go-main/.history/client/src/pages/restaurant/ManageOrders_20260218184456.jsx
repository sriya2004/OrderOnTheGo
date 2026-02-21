import { useEffect, useState } from "react";
import API from "../../api/api";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await API.get("/orders/restaurant");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, {
      orderStatus: status,
    });
    loadOrders();
  };

  return (
    <div className="container">
      <h4>Manage Orders</h4>

      {orders.map((o) => (
        <div key={o._id} className="border p-3 mb-2">
          <div>Order #{o.orderId}</div>

          <select
            value={o.orderStatus}
            onChange={(e) => updateStatus(o._id, e.target.value)}
          >
            <option>Pending</option>
            <option>Preparing</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default ManageOrders;
