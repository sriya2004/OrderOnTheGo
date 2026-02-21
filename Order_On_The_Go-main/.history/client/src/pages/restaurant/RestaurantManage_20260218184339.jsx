import { Link } from "react-router-dom";

function RestaurantManage() {
  return (
    <div className="container py-4">
      <h3>Manage Restaurant</h3>

      <div className="row mt-4">
        <div className="col-md-6">
          <Link to="/restaurant/manage/items" className="pill-btn accent w-100">
            🍽 Manage Items
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/restaurant/manage/orders" className="pill-btn w-100">
            📦 Manage Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RestaurantManage;
