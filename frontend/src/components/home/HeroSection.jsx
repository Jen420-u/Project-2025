import { useNavigate } from "react-router-dom";
import herobg from "../../includes/hero-bg.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/allproduct");
  };

  return (
    <div
      className="relative hero-section bg-cover bg-center text-white h-[90vh]"
      style={{ backgroundImage: `url(${herobg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Step into Style</h1>
        <p className="text-xl md:text-2xl font-semibold mb-6 max-w-2xl">
          Discover the latest collection of sneakers for every occasion.
        </p>
        <button
          onClick={handleShopNow}
          className="bg-black text-white py-3 px-8 text-lg rounded-md hover:bg-gray-200 transition"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
