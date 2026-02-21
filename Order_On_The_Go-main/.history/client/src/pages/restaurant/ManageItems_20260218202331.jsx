import { useEffect, useState } from "react";
import API from "../../api/api";

function ManageItems() {
    const [foods, setFoods] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
    });
    const [editingId, setEditingId] = useState(null);

    const loadFoods = async () => {
        const res = await API.get("/food/my");
        setFoods(res.data || []);
    };

    useEffect(() => {
        loadFoods();
    }, []);

    const handleSubmit = async () => {
        if (editingId) {
            await API.put(`/restaurants/food/${editingId}`, form);
        } else {
            await API.post("/restaurants/food", form);
        }
        setForm({ name: "", price: "", image: "", description: "" });
        setEditingId(null);
        loadFoods();
    };

    const toggleStatus = async (id, enabled) => {
        await API.put(`/restaurants/food/${id}`, { enabled: !enabled });
        loadFoods();
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-3">🍽️ Manage Items</h3>

            {/* FORM */}
            <div className="card p-3 mb-4">
                <input
                    placeholder="Item Name"
                    className="form-control mb-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder="Price"
                    className="form-control mb-2"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                    placeholder="Image URL"
                    className="form-control mb-2"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                {form.image && (
                    <img
                        src={form.image}
                        alt="preview"
                        className="img-preview mb-2"
                    />
                )}
                <textarea
                    placeholder="Description"
                    className="form-control mb-2"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <button className="pill-btn accent" onClick={handleSubmit}>
                    {editingId ? "Update Item" : "Add Item"}
                </button>
            </div>

            {/* ITEMS */}
            {foods.map((food) => (
                <div
                    key={food._id}
                    className="d-flex justify-content-between align-items-center border p-3 mb-2 fade-in"
                >
                    <div>
                        <strong>{food.name}</strong>
                        <div className="text-muted">₹{food.price}</div>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                                setEditingId(food._id);
                                setForm(food);
                            }}
                        >
                            Edit
                        </button>

                        <button
                            className={`btn btn-sm ${food.enabled ? "btn-success" : "btn-secondary"
                                }`}
                            onClick={() => toggleStatus(food._id, food.enabled)}
                        >
                            {food.enabled ? "Enabled" : "Disabled"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ManageItems;
