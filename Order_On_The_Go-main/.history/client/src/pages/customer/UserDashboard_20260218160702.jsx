import { useEffect, useState } from "react";
import API from "../../api/api";

function UserDashboard() {
  const [foods, setFoods] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    API.get("/food")
      .then(res => setFoods(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = async (food) => {
    try {
      await API.post("/cart", { foodId: food._id, quantity: 1 });
      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const categories = [
    { label: "Breakfast", icon: "B" },
    { label: "Biriyani", icon: "Br" },
    { label: "Pizza", icon: "P" },
    { label: "Noodles", icon: "N" },
    { label: "Burger", icon: "Bg" }
  ];

  const visibleFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );

  const restaurantMap = new Map();
  foods.forEach((food) => {
    if (food.restaurant && !restaurantMap.has(food.restaurant._id)) {
      restaurantMap.set(food.restaurant._id, food.restaurant);
    }
  });
  const restaurants = Array.from(restaurantMap.values());

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="hero-card mb-4">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
            <div>
              <h2 className="section-title">Order great food, fast.</h2>
              <p className="text-muted mb-0">Browse dishes, add to cart, and track your order in minutes.</p>
            </div>
            <div className="nav-search" style={{ maxWidth: 420 }}>
              <input
                type="text"
                placeholder="Search dishes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="text-muted">🔍</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="section-title mb-3">Top Categories</div>
            <div className="category-row">
              {categories.map((cat) => (
                <div key={cat.label} className="category-pill">
                  <div className="category-avatar">{cat.icon}</div>
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="section-title mb-3">Popular Restaurants</div>
          <div className="restaurant-grid">
            {restaurants.length === 0 && <div className="text-muted">No restaurants yet.</div>}
            {restaurants.map((rest) => (
              <div key={rest._id} className="restaurant-card">
                <div className="restaurant-thumb">{rest.name}</div>
                <div className="mt-3">
                  <div className="fw-bold">{rest.name}</div>
                  <div className="food-meta">{rest.address || ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title mb-3">Popular Dishes</div>
          <div className="food-grid">
            {visibleFoods.map((food) => (
              <div key={food._id} className="food-card">
                {food.image && (
                  <img
  src={food.image}
  alt={food.name}
  className="food-image mb-3"
  style={{ height: '180px', width: '100%', objectFit: 'cover' }} // Ensures all images are same size
  onError={(e) => { 
    e.target.src = "https://via.placeholder.com/300x180?text=Delicious+Food"; 
  }}
/>
                )}
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6>{food.name}</h6>
                    <div className="food-meta">{food.restaurant?.name || ""}</div>
                  </div>
                  <div className="price-tag">₹{food.price}</div>
                </div>
                <p className="food-meta mt-2">{food.description || "Freshly made and packed."}</p>
                <button className="pill-btn accent w-100" onClick={() => addToCart(food)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;