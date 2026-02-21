import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      const userRole = res.data.user.role;
      if (userRole === "admin") navigate("/admin");
      else if (userRole === "restaurant") navigate("/restaurant");
      else navigate("/user");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg border-0 p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "20px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Welcome Back!</h2>
          <p className="text-muted">Login to OrderOnTheGo</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="email">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="role">Login as</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-warning w-100 fw-bold py-2 text-white shadow-sm" style={{ background: "linear-gradient(to right, #ff9800, #ff5722)", border: "none" }}>
            Login
          </button>
          {error && <div className="text-danger text-center mt-3">{error}</div>}
        </form>
        <p className="text-center mt-3 small">
          Don't have an account? <Link to="/register" className="text-decoration-none text-warning fw-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;