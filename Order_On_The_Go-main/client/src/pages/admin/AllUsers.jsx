import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

function AllUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.get("/admin/users")
            .then((res) => setUsers(res.data || []))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="admin-shell">
            <div className="container">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="section-title mb-0">User Management</h2>
                        <p className="text-muted">View and manage all registered platform users.</p>
                    </div>
                    <Link to="/admin" className="pill-btn">Back to Dashboard</Link>
                </div>

                {/* Users Table */}
                <div className="dashboard-panel">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>User Information</th>
                                    <th>Contact Email</th>
                                    <th className="text-center">Account Role</th>
                                    <th className="text-end">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                                    <div className="user-avatar-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-muted">{user.email}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <span className="text-success small fw-bold">● Active</span>
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

export default AllUsers;