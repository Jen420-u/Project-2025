import { useNavigate } from "react-router-dom";
import { SiNike, SiPuma, SiAdidas, SiReebok, SiNewbalance } from "react-icons/si";
import "./styles/Home.css";

const PopularBrands = () => {
  const navigate = useNavigate();

  // Update the brands array to be an array of objects with name, icon, and path
  const brandIcons = [
    { name: "Nike", icon: <SiNike className="text-5xl text-gray-800" />, path: "brand/nike" },
    { name: "Puma", icon: <SiPuma className="text-5xl text-gray-800" />, path: "brand/puma" },
    { name: "Adidas", icon: <SiAdidas className="text-5xl text-gray-800" />, path: "brand/adidas" },
    { name: "Reebok", icon: <SiReebok className="text-5xl text-gray-800" />, path: "brand/reebok" },
    { name: "New Balance", icon: <SiNewbalance className="text-5xl text-gray-800" />, path: "brand/newbalance" }
  ];

  // Navigate to the brand page when clicked
  const handleBrandClick = (path) => {
    navigate(path);
  };

  return (
    <div className="popular-brands px-10 py-16">
      <h2 className="text-3xl font-bold mb-8">Popular Brands</h2>
      <div className="flex gap-6 justify-center">
        {brandIcons.map((brand, index) => (
          <div
            key={index}
            className="brand-card border p-4 rounded-md shadow-md text-center cursor-pointer"
            onClick={() => handleBrandClick(brand.path)} // Navigate on click
          >
            {brand.icon} {/* Render the brand icon */}
            <p className="text-xl font-bold">{brand.name}</p> {/* Render the brand name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularBrands;
