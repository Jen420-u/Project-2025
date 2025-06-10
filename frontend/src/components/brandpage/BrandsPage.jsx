import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api, { BASE_URL } from "../../api";
import { Link } from "react-router-dom";
import { SiNike, SiPuma, SiAdidas, SiReebok, SiNewbalance } from "react-icons/si";

// Brand icon mapping
const brandIcons = {
  nike: <SiNike className="text-5xl text-gray-800" />,
  puma: <SiPuma className="text-5xl text-gray-800" />,
  adidas: <SiAdidas className="text-5xl text-gray-800" />,
  reebok: <SiReebok className="text-5xl text-gray-800" />,
  newbalance: <SiNewbalance className="text-5xl text-gray-800" />,
};

const BrandsPage = () => {
  const { brand } = useParams(); // Get brand name from URL
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`get_brand/${brand}/`) // Fetch dynamically based on brand
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        setError("Error fetching data");
        console.error(err);
      });
  }, [brand]); // Refetch when brand changes

  // Capitalize brand name properly
  const formattedBrand = brand
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-gray-100 py-8 px-4">
      {/* Display brand icon */}
      <div className="flex justify-center items-center mb-6">
        {brandIcons[brand.toLowerCase()] ? (
          brandIcons[brand.toLowerCase()]
        ) : (
          <h2 className="text-2xl font-bold text-gray-800">{formattedBrand}</h2>
        )}
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`} // Navigate to product detail page
              className="bg-white rounded-lg shadow-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
            >
              <img
                src={`${BASE_URL}${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <div className="text-center flex-1">
                <h3 className="text-xs font-medium !text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-700 text-lg font-semibold">
                    Rs.{product.price ? product.price : "N/A"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-700">No products found</p>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
