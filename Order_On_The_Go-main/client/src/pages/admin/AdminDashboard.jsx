import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

function AdminDashboard() {
	const [users, setUsers] = useState([]);
	const [restaurants, setRestaurants] = useState([]);
	const [orders, setOrders] = useState([]);

	const loadDashboard = async () => {
		try {
			const [usersRes, restRes, ordersRes] = await Promise.all([
				API.get("/admin/users"),
				API.get("/admin/restaurants"),
				API.get("/admin/orders")
			]);
			setUsers(usersRes.data || []);
			setRestaurants(restRes.data || []);
			setOrders(ordersRes.data || []);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const pendingApprovals = restaurants.filter((rest) => !rest.approved);

	const handleApprove = async (id) => {
		try {
			await API.put(`/admin/approve/${id}`);
			await loadDashboard();
		} catch (err) {
			console.error(err);
		}
	};

	// Inside your AdminDashboard return statement:
return (
  <div className="admin-shell">
    <div className="container">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="section-title mb-0">Admin Overview</h2>
          <p className="text-muted">Manage your restaurants, orders, and users.</p>
        </div>
        <div className="dashboard-actions d-flex gap-2">
          <Link to="/admin/users" className="dark-btn outline-accent">Manage Users</Link>
          <Link to="/admin/restaurants" className="dark-btn outline-accent">Restaurants</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="dashboard-panel text-center">
            <h6 className="text-uppercase text-muted small fw-bold">Total Users</h6>
            <div className="display-5 fw-bold text-indigo">{users.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-panel text-center">
            <h6 className="text-uppercase text-muted small fw-bold">Active Restaurants</h6>
            <div className="display-5 fw-bold text-indigo">{restaurants.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-panel text-center">
            <h6 className="text-uppercase text-muted small fw-bold">Total Orders</h6>
            <div className="display-5 fw-bold text-indigo">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Tables/Lists Section */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="dashboard-panel h-100">
            <h5 className="mb-4 fw-bold">Pending Approvals</h5>
            {pendingApprovals.length === 0 ? (
              <div className="alert alert-light border-0 text-center py-4">No pending requests</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Restaurant Name</th>
                      <th>Location</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map((rest) => (
                      <tr key={rest._id}>
                        <td className="fw-bold">{rest.name}</td>
                        <td className="text-muted small">{rest.address}</td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-success px-3 rounded-pill" 
                            onClick={() => handleApprove(rest._id)}
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default AdminDashboard;
