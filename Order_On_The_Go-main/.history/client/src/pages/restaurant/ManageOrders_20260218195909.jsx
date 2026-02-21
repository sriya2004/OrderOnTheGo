import { useEffect, useState } from "react";
import API from "../../api/api";

const steps = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

function ManageOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        API.get("/orders/restaurant").then(res => setOrders(res.data));
    }, []);

    const updateStatus = async (orderId, status) => {
        await API.put(`/orders/${orderId}/status`, { orderStatus: status });
        setOrders(prev =>
            prev.map(o =>
                o._id === orderId ? { ...o, orderStatus: status } : o
            )
        );
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold mb-4">📦 Orders</h2>

            {orders.map(order => (
                <div key={order._id} className="dashboard-panel mb-3">
                    <div className="fw-bold">
                        #{order.orderId} — ₹{order.totalAmount}
                    </div>

                    {order.orderStatus === "Cancelled" ? (
                        <span className="badge bg-danger mt-2">Cancelled</span>
                    ) : (
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {steps.map(step => (
                                <button
                                    key={step}
                                    className={`pill-btn ${order.orderStatus === step ? "accent" : ""
                                        }`}
                                    onClick={() => updateStatus(order._id, step)}
                                >
                                    {step}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ManageOrders;
