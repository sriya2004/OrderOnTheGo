import { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";

function AllRestaurants() {
    const [restaurants, setRestaurants] = useState([]);

    const loadRestaurants = async () => {
        try {
            const res = await API.get("/admin/restaurants");
            setRestaurants(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadRestaurants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApprove = async (id) => {
        try {
            await API.put(`/admin/approve/${id}`);
            await loadRestaurants();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-shell">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="section-title mb-0">Restaurant Partners</h2>
                        <p className="text-muted">Manage, verify, and approve restaurant listings.</p>
                    </div>
                    <Link to="/admin" className="pill-btn">Back to Dashboard</Link>
                </div>

                <div className="dashboard-panel">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Restaurant Name</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restaurants.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No restaurants found.</td>
                                    </tr>
                                ) : (
                                    restaurants.map((rest) => (
                                        <tr key={rest._id}>
                                            <td>
                                                <div className="fw-bold text-dark">{rest.name}</div>
                                                <div className="small text-muted">{rest.email || "No email provided"}</div>
                                            </td>
                                            <td>
                                                <div className="text-muted small">{rest.address}</div>
                                            </td>
                                            <td>
                                                {rest.approved ? (
                                                    <span className="badge-status approved">Approved</span>
                                                ) : (
                                                    <span className="badge-status pending">Pending</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                {!rest.approved && (
                                                    <button className="btn-approve" onClick={() => handleApprove(rest._id)}>
                                                        Approve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllRestaurants;