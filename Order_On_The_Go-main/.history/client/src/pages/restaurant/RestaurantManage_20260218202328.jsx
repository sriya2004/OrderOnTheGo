import { Link } from "react-router-dom";

function RestaurantManage() {
    return (
        <div className="container mt-5">
            <h2 className="fw-bold mb-4">🛠️ Manage Hub</h2>

            <div className="row g-4">
                <div className="col-md-6">
                    <Link to="/restaurant/manage/items" className="dashboard-panel d-block">
                        <h4>🍽️ Manage Items</h4>
                        <p>Add / edit / enable or disable menu items</p>
                    </Link>
                </div>

                <div className="col-md-6">
                    <Link to="/restaurant/manage/orders" className="dashboard-panel d-block">
                        <h4>📦 Manage Orders</h4>
                        <p>Update order status & view details</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RestaurantManage;
