import { useState, useEffect } from "react";
import api, { BASE_URL } from "../../api";
import { Link } from "react-router-dom";

const WomenProductPage = () => {
  const [womenProducts, setWomenProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("women_products/") // Fetch only Women's products
      .then((res) => {
        setWomenProducts(res.data);
      })
      .catch((err) => {
        setError("Error fetching data");
        console.error(err);
      });
  }, []);

  return (
    <div className="bg-gray-100 py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Women&apos;s Collection
      </h2>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {womenProducts.length > 0 ? (
          womenProducts.map((product) => {
            return (
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
                    <p className="text-lg font-semibold !text-gray-900">
                      {product.discounted_price && product.discounted_price < product.price ? (
                        <>
                          <span className="line-through !text-gray-500 mr-2">Rs.{product.price}</span>
                          <span className="text-red-500">Rs.{product.discounted_price}</span>
                        </>
                      ) : (
                        `Rs.${product.price ? product.price : "N/A"}`
                      )}
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
  );
};

export default WomenProductPage;
