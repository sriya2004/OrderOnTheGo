import { useEffect, useState } from "react";
import API from "../../api/api";

function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState(null);

    const loadOrders = async () => {
        const res = await API.get("/orders/restaurant");
        setOrders(res.data || []);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-3">📦 Orders</h3>

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="border p-3 mb-2 hover-card"
                    onClick={() => setSelected(order)}
                >
                    <strong>#{order.orderId}</strong> — ₹{order.totalAmount}
                </div>
            ))}

            {/* MODAL */}
            {selected && (
                <div className="modal-backdrop">
                    <div className="modal-box slide-up">
                        <h5>Order #{selected.orderId}</h5>
                        <ul>
                            {selected.items.map((i) => (
                                <li key={i._id}>
                                    {i.food.name} × {i.quantity}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="pill-btn border-danger text-danger"
                            onClick={() => setSelected(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageOrders;
