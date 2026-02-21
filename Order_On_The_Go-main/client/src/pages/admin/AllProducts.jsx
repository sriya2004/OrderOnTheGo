import { useEffect, useState } from "react";
import API from "../../api/api";

function AllProducts() {
	const [foods, setFoods] = useState([]);

	useEffect(() => {
		API.get("/admin/foods")
			.then((res) => setFoods(res.data || []))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="page-wrap">
			<div className="container">
				<h2 className="section-title mb-4">All products</h2>
				<div className="food-grid">
					{foods.map((food) => (
						<div key={food._id} className="food-card">
							<div className="d-flex justify-content-between align-items-start">
								<div>
									<h6>{food.name}</h6>
									<div className="food-meta">{food.restaurant?.name || ""}</div>
								</div>
								<div className="price-tag">₹{food.price}</div>
							</div>
							<p className="food-meta mt-2">{food.description || ""}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default AllProducts;
