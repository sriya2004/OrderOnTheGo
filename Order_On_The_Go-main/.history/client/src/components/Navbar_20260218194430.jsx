import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [showManage, setShowManage] = useState(false);

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

        {/* SEARCH BAR */}
        {token && (
          <div className="nav-search d-none d-md-flex align-items-center flex-grow-1 mx-4">
            <input
              type="text"
              placeholder="Search restaurants, cuisine, etc."
            />
            <span style={{ cursor: "pointer" }}>🔍</span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="d-flex align-items-center gap-2 position-relative">
          {!token ? (
            <>
              <Link to="/login" className="pill-btn">
                Login
              </Link>
              <Link to="/register" className="pill-btn accent">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* USER */}
              {role === "user" && (
                <>
                  <Link to="/cart" className="pill-btn d-none d-sm-block">
                    🛒 Cart
                  </Link>
                  <Link to="/orders" className="pill-btn d-none d-sm-block">
                    📦 My Orders
                  </Link>
                </>
              )}

              {/* ADMIN */}
              {role === "admin" && (
                <Link to="/admin" className="pill-btn">
                  Dashboard
                </Link>
              )}

              {/* RESTAURANT DROPDOWN */}
              {role === "restaurant" && (
                <div className="dropdown">
                  <button
                    className="pill-btn text-primary"
                    onClick={() => setShowManage(!showManage)}
                  >
                    Manage ⌄
                  </button>

                  {showManage && (
                    <div className="dropdown-menu show">
                      <Link
                        to="/restaurant"
                        className="dropdown-item"
                        onClick={() => setShowManage(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/restaurant/manage"
                        className="dropdown-item"
                        onClick={() => setShowManage(false)}
                      >
                        Manage Hub
                      </Link>
                      <Link
                        to="/restaurant/manage/items"
                        className="dropdown-item"
                        onClick={() => setShowManage(false)}
                      >
                        Items
                      </Link>
                      <Link
                        to="/restaurant/manage/orders"
                        className="dropdown-item"
                        onClick={() => setShowManage(false)}
                      >
                        Orders
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* LOGOUT */}
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
