import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link className="brand-text fw-bold" to="/">
          <span className="brand-mark">SB</span> Foods
        </Link>

        {/* Search Bar - Hidden on small screens if needed */}
        <div className="nav-search d-none d-md-flex align-items-center flex-grow-1 mx-4">
          <input type="text" placeholder="Search restaurants, cuisine, etc." />
          <span style={{ cursor: 'pointer' }}>🔍</span>
        </div>

        {/* Buttons Group */}
        <div className="d-flex align-items-center gap-2">
          {!token ? (
            <>
              <Link to="/login" className="pill-btn">Login</Link>
              <Link to="/register" className="pill-btn accent">Sign Up</Link>
            </>
          ) : (
            <>
              {/* Dynamic Links Based on Role */}
              {role === "user" && (
                <Link to="/cart" className="pill-btn d-none d-sm-block">🛒 Cart</Link>
              )}
              {role === "admin" && (
                <Link to="/admin" className="pill-btn">Dashboard</Link>
              )}
              {role === "restaurant" && (
                <Link to="/restaurant" className="pill-btn text-primary">Manage</Link>
              )}
              
              <button onClick={handleLogout} className="pill-btn border-danger text-danger">
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