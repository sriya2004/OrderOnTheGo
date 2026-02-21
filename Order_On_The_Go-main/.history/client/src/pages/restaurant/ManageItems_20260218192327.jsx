import { useEffect, useState } from "react";
import API from "../../api/api";

function ManageItems() {
    const [foods, setFoods] = useState([]);

    const loadFoods = async () => {
        const res = await API.get("/restaurants/my-foods");
        setFoods(res.data);
    };

    useEffect(() => {
        loadFoods();
    }, []);

    const toggleStatus = async (id) => {
        await API.patch(`/restaurants/food/${id}/toggle`);
        loadFoods();
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4">🍽️ Manage Items</h3>

            {foods.map(food => (
                <div key={food._id} className="dashboard-panel mb-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3 align-items-center">
                        <img
                            src={food.image}
                            alt={food.name}
                            style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }}
                        />
                        <div>
                            <div className="fw-bold">{food.name}</div>
                            <small>₹{food.price}</small>
                        </div>
                    </div>

                    <button
                        className={`btn ${food.isActive ? "btn-danger" : "btn-success"}`}
                        onClick={() => toggleStatus(food._id)}
                    >
                        {food.isActive ? "Disable" : "Enable"}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ManageItems;
