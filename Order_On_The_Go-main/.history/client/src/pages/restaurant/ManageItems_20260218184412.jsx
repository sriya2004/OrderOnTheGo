import { useEffect, useState } from "react";
import API from "../../api/api";

function ManageItems() {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const loadFoods = async () => {
    const profile = await API.get("/restaurants/profile");
    const res = await API.get(`/food/restaurant/${profile.data._id}`);
    setFoods(res.data);
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const addFood = async () => {
    await API.post("/restaurants/food", {
      name,
      price,
      image,
      description,
    });
    loadFoods();
  };

  return (
    <div className="container">
      <h4>Manage Items</h4>

      {foods.map((f) => (
        <div key={f._id}>
          {f.name} – ₹{f.price}
        </div>
      ))}

      <button onClick={addFood}>Add Item</button>
    </div>
  );
}

export default ManageItems;
