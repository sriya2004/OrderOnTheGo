import { useEffect, useState } from "react";
import API from "../../api/api";

function FoodList() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    API.get("/food")
      .then((res) => setFoods(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🍽 Available Foods</h2>

      {foods.map((food) => (
        <div key={food._id} style={{ border: "1px solid #ff0000", margin: 10 }}>
          <h4>{food.name}</h4>
          <p>₹{food.price}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default FoodList;