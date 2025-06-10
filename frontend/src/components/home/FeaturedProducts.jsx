import { useState, useEffect } from "react";
import api, { BASE_URL } from "../../api";
import "./styles/Home.css";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("products") // Fetch all products
      .then((res) => {
        setProducts(res.data.slice(0, 7)); // Only keep the first 7 products
      })
      .catch((err) => {
        setError("Error fetching data");
        console.error(err);
      });
  }, []);

  // Scroll functionality
  const scroll = (direction) => {
    const container = document.getElementById("featured-card-container");
    const scrollAmount = direction === "left" ? -200 : 200;

    if (direction === "left" && container.scrollLeft === 0) {
      // If at the leftmost position, scroll to the end
      container.scrollLeft = container.scrollWidth;
    } else if (direction === "right" && container.scrollLeft === container.scrollWidth - container.clientWidth) {
      // If at the rightmost position, scroll to the beginning
      container.scrollLeft = 0;
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="featured-products-section section py-8 px-4 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Featured Products
      </h2>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <div className="relative">
        <button
          className="featured-scroll-btn left"
          onClick={() => scroll("left")}
        >
          &lt;
        </button>
        <button
          className="featured-scroll-btn right"
          onClick={() => scroll("right")}
        >
          &gt;
        </button>
        <div
          id="featured-card-container"
          className="featured-card-container flex gap-4 overflow-x-auto"
        >
          {products.length > 0 ? (
            products.map((product) => {
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="featured-card min-w-[220px] bg-white rounded-lg shadow-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl no-underline flex flex-col"
                >
                  <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <div className="text-center flex-1">
                    <h3 className="text-xs font-small text-gray-900 truncate no-underline">
                      {product.name}
                    </h3>
                    <p className="text-gray-700 text-lg font-semibold no-underline">
                      Rs.{product.price ? product.price : "N/A"}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-gray-700">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
