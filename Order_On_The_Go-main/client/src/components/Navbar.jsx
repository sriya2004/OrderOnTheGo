import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container d-flex align-items-center justify-content-between">
        {/* BRAND */}
        <Link className="brand-text fw-bold" to={token ? `/${role}` : "/"}>
          <span className="brand-mark">SB</span> Foods
        </Link>

        {/* SEARCH */}
        {token && (
          <div className="nav-search d-none d-md-flex mx-4">
            <input placeholder="Search restaurants, cuisine, etc." />
            🔍
          </div>
        )}

        {/* ACTIONS */}
        <div className="d-flex align-items-center gap-2">
          {!token ? (
            <>
              <Link to="/login" className="pill-btn">Login</Link>
              <Link to="/register" className="pill-btn accent">Sign Up</Link>
            </>
          ) : (
            <>
              {/* USER */}
              {role === "user" && (
                <>
                  <Link to="/cart" className="pill-btn">🛒 Cart</Link>
                  <Link to="/orders" className="pill-btn">📦 My Orders</Link>
                </>
              )}

              {/* RESTAURANT */}
              {role === "restaurant" && (
                <div className="position-relative">
                  <button
                    className="pill-btn"
                    onClick={() => setOpen(!open)}
                  >
                    Manage
                    <span className="badge bg-danger ms-2">1</span>
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="dropdown-menu show"
                        style={{ position: "absolute", right: 0 }}
                      >
                        <Link
                          to="/restaurant"
                          className="dropdown-item"
                          onClick={() => setOpen(false)}
                        >
                          Dashboard
                        </Link>

                        <Link
                          to="/restaurant/manage"
                          className="dropdown-item"
                          onClick={() => setOpen(false)}
                        >
                          Manage Hub
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ADMIN */}
              {role === "admin" && (
                <Link to="/admin" className="pill-btn">Admin</Link>
              )}

              <button
                onClick={handleLogout}
                className="pill-btn border-danger text-danger"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
