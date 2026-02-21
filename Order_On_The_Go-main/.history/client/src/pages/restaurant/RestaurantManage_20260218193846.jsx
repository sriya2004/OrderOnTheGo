import { Link } from "react-router-dom";

function RestaurantManage() {
    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">🛠️ Restaurant Management</h2>

            <div className="row g-4">
                <div className="col-md-6">
                    <Link to="/restaurant/manage/items" className="manage-card">
                        🍽️ Manage Menu Items
                    </Link>
                </div>

                <div className="col-md-6">
                    <Link to="/restaurant/manage/orders" className="manage-card">
                        📦 Manage Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RestaurantManage;
