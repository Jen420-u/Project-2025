import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const SpecialDeals = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="special-deals bg-gray-100 px-10 py-16">
      <h2 className="text-3xl font-bold mb-8">Special Deals</h2>
      <div className="flex items-center justify-between bg-black text-white p-8 rounded-md">
        <div>
          <h3 className="text-2xl font-bold">Up to 50% Off!</h3>
          <p className="text-lg">Grab your favorite sneakers at amazing discounts.</p>
        </div>
        <button
          onClick={() => navigate("/sale")} // Navigate to the sale page
          className="bg-white text-black py-2 px-6 rounded-md hover:bg-gray-200"
        >
          Shop Deals
        </button>
      </div>
    </div>
  );
};

export default SpecialDeals;
