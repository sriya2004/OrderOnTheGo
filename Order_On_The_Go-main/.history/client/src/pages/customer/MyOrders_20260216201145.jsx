import { useEffect, useState } from "react";
import API from "../../api/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // 🔄 live refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="card p-3 mb-3">
          <h6>Order ID: {order.orderId}</h6>
          <p>Total: ₹{order.totalAmount}</p>

          <span className={`badge status-${order.orderStatus.replace(/ /g, "")}`}>
            {order.orderStatus}
          </span>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;