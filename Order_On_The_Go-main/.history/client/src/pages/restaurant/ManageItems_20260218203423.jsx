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
    const [loading, setLoading] = useState(false);

    /* =========================
       LOAD FOODS
    ========================= */
    const loadFoods = async () => {
        try {
            const res = await API.get("/restaurants/foods");
            setFoods(res.data || []);
        } catch (err) {
            console.error("Load foods error:", err);
        }
    };

    useEffect(() => {
        loadFoods();
    }, []);

    /* =========================
       ADD / UPDATE ITEM
    ========================= */
    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (editingId) {
                await API.put(`/restaurants/foods/${editingId}`, form);
            } else {
                await API.post("/restaurants/foods", form);
            }

            setForm({ name: "", price: "", image: "", description: "" });
            setEditingId(null);
            loadFoods();
        } catch (err) {
            console.error("Save item error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       EDIT ITEM
    ========================= */
    const startEdit = (food) => {
        setEditingId(food._id);
        setForm({
            name: food.name,
            price: food.price,
            image: food.image,
            description: food.description,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* =========================
       TOGGLE AVAILABILITY
    ========================= */
    const toggleAvailability = async (foodId) => {
        try {
            await API.patch(`/restaurants/foods/${foodId}/toggle`);
            loadFoods();
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    /* =========================
       DELETE ITEM
    ========================= */
    const deleteItem = async (foodId) => {
        if (!window.confirm("Delete this item?")) return;

        try {
            await API.delete(`/restaurants/foods/${foodId}`);
            loadFoods();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4">🍽️ Manage Items</h3>

            {/* ADD / EDIT FORM */}
            <div className="card p-4 mb-5 shadow-sm">
                <h5 className="fw-bold mb-3">
                    {editingId ? "✏️ Update Item" : "➕ Add New Item"}
                </h5>

                <input
                    className="form-control mb-2"
                    placeholder="Item Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Price (₹)"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                />

                {/* IMAGE PREVIEW */}
                {form.image && (
                    <img
                        src={form.image}
                        alt="Preview"
                        style={{
                            width: "100%",
                            maxHeight: "180px",
                            objectFit: "cover",
                            borderRadius: "10px",
                        }}
                        className="mb-2"
                    />
                )}

                <textarea
                    className="form-control mb-3"
                    rows="3"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <button
                    className="pill-btn accent"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {editingId ? "Update Item" : "Add Item"}
                </button>
            </div>

            {/* ITEMS LIST */}
            {foods.length === 0 ? (
                <p className="text-muted">No items added yet.</p>
            ) : (
                foods.map((food) => (
                    <div
                        key={food._id}
                        className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
                    >
                        <div>
                            <div className="fw-bold">{food.name}</div>
                            <div className="text-muted">₹{food.price}</div>
                            <span
                                className={`badge ${food.isAvailable ? "bg-success" : "bg-secondary"
                                    }`}
                            >
                                {food.isAvailable ? "Available" : "Disabled"}
                            </span>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => startEdit(food)}
                            >
                                Edit
                            </button>

                            <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() => toggleAvailability(food._id)}
                            >
                                {food.isAvailable ? "Disable" : "Enable"}
                            </button>

                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteItem(food._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ManageItems;
