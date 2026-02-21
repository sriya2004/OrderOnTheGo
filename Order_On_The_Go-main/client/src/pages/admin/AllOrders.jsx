import { useEffect, useState } from "react";
import API from "../../api/api";

function AllOrders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		API.get("/admin/orders")
			.then((res) => setOrders(res.data || []))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="page-wrap">
			<div className="container">
				<h2 className="section-title mb-4">All orders</h2>
				<div className="cart-panel">
					<div className="d-grid gap-3">
						{orders.map((order) => (
							<div key={order._id} className="d-flex justify-content-between align-items-center">
								<div>
									<div className="fw-bold">{order.user?.name || "User"}</div>
									<div className="food-meta">{order.items?.length || 0} items</div>
									<div className="food-meta">{order.deliveryAddress}</div>
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
	);
}

export default AllOrders;
