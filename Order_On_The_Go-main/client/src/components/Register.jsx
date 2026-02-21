import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ role: "user" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="card shadow-lg border-0 p-4" style={{ width: "100%", maxWidth: "450px", borderRadius: "20px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-muted">Join the Foodie Community</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="mb-3"><input className="form-control py-2" placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="mb-3"><input className="form-control py-2" type="email" placeholder="Email Address" onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="mb-3">
            <select
              className="form-select py-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">Customer</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <div className="mb-3"><input className="form-control py-2" type="password" placeholder="Create Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <div className="mb-3"><textarea className="form-control" placeholder="Delivery Address" rows="2" onChange={(e) => setForm({ ...form, address: e.target.value })} required></textarea></div>
          
          <button type="submit" className="btn btn-warning w-100 fw-bold py-2 text-white shadow-sm" style={{ background: "linear-gradient(to right, #ff9800, #ff5722)", border: "none" }}>
            Create Account
          </button>
        </form>
        <p className="text-center mt-3 small">
          Already a member? <Link to="/" className="text-decoration-none text-warning fw-bold">Login</Link>
        </p>
        {form.role === "restaurant" && (
          <p className="text-center mt-2 small text-muted">Restaurant accounts require admin approval.</p>
        )}
      </div>
    </div>
  );
}

export default Register;