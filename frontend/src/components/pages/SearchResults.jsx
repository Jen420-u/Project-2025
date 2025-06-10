import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api, {BASE_URL} from "../../api";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      api.get(`/product_search/?q=${query}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error("Search Error:", err));
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for {query}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
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
                  <p className="text-gray-700 text-lg font-semibold">
                    Rs.{ product.price ? product.price : "N/A"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default SearchResults;
