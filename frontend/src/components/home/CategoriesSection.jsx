import { useNavigate } from "react-router-dom";
import menimage from "../../includes/men.jpg";
import womenimage from "../../includes/women.jpg";
import kidsimage from "../../includes/kids.jpg";
import "./styles/Home.css";

const CategoriesSection = () => {
  const navigate = useNavigate(); // Hook for navigation

  const categories = [
    { id: 1, name: "Men", image: menimage, path: "/men" },
    { id: 2, name: "Women", image: womenimage, path: "/women" },
    { id: 3, name: "Kids", image: kidsimage, path: "/kids" },
  ];

  return (
    <div className="categories-section px-10 py-16">
      <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card relative overflow-hidden rounded-md shadow-md cursor-pointer"
            onClick={() => navigate(category.path)} // Navigate on click
          >
            <img src={category.image} alt={category.name} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-2xl">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
