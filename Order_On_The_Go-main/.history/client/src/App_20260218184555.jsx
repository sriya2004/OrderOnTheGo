import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";

/* CUSTOMER PAGES */
import Cart from "./pages/customer/Cart";
import MyOrders from "./pages/customer/MyOrders";
import UserDashboard from "./pages/customer/UserDashboard";
import UserProfile from "./pages/customer/UserProfile";

/* RESTAURANT PAGE */
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";

/* ADMIN PAGES */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllOrders from "./pages/admin/AllOrders";
import AllProducts from "./pages/admin/AllProducts";
import AllRestaurants from "./pages/admin/AllRestaurants";
import AllUsers from "./pages/admin/AllUsers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="user">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="user">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= RESTAURANT ROUTES ================= */}
        <Route
          path="/restaurant"
          element={
            <ProtectedRoute role="restaurant">
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/restaurant" element={<RestaurantDashboard />} />
<Route path="/restaurant/manage" element={<RestaurantManage />} />
<Route path="/restaurant/manage/items" element={<ManageItems />} />
<Route path="/restaurant/manage/orders" element={<ManageOrders />} />


        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AllUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute role="admin">
              <AllRestaurants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="admin">
              <AllOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <AllProducts />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
