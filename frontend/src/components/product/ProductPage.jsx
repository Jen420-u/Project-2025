import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api, { BASE_URL } from "../../api";
import ProductPagePlaceHolder from "./ProductPagePlaceHolder";
import RelatedProducts from "./RelatedProducts";
import { toast } from "react-toastify";

const KIDS_SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 14, 15];
const ADULT_SIZES = Array.from({ length: (48 - 20) / 2 + 1 }, (_, i) => 20 + i * 2);

const ProductPage = ({ setNumberCartItems }) => {
  const { slug } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [inCart, setInCart] = useState(false); 
  const [selectedSize, setSelectedSize] = useState(null);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(5); // Default to 5 stars
  const [showReviews, setShowReviews] = useState(false); // Toggle for showing reviews
  const [reviewsWithUsernames, setReviewsWithUsernames] = useState([]); // Store reviews with usernames
  const cart_code = localStorage.getItem("cart_code");

  useEffect(() => {
    api.get(`/product_detail/${slug}/`)
      .then((res) => {
        setProduct(res.data);
        setRelatedProducts(res.data.similar_products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (product && product.id) {
      api.get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
        .then((res) => setInCart(res.data.product_in_cart))
        .catch((err) => console.log(err.message));
    }
  }, [cart_code, product]);

  // Fetch reviews when the product is loaded
  useEffect(() => {
    if (product && product.id) {
      api.get(`/get_reviews/${slug}/`)
        .then((res) => {
          setReviewsWithUsernames(res.data);
        })
        .catch((err) => {
          console.log("Error fetching reviews:", err.message);
        });
    }
  }, [slug, product]);

  const getSizes = () => {
    if (product?.category?.toLowerCase() === "kids") return KIDS_SIZES;
    if (["men", "women"].includes(product?.category?.toLowerCase())) return ADULT_SIZES;
    return [];
  };

  const SIZES = getSizes();

  // Calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Function to display the stars based on the rating
  const renderStars = (rating) => {
    const stars = Array(Math.floor(rating)).fill("⭐");
    if (rating % 1 !== 0) {
      stars.push("⭐");
    }
    return stars;
  };

  function add_item() {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    if (product && !inCart) {
      api.post("add_item/", { cart_code, product_id: product.id, size: selectedSize })
        .then(() => {
          setInCart(true);
          toast.success("Product added to Cart");
          setNumberCartItems((curr) => curr + 1);
        })
        .catch((err) => console.log(err.message));
    }
  }

  const submitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You need to log in to submit a review.");
      return;
    }

    const token = localStorage.getItem("access");
    try {
      const response = await api.post(
        `/submit_review/${slug}/`,
        { rating: userRating, comment: userReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted successfully!");

      const newReview = {
        rating: response.data.data.rating || 0, // Use the updated rating value from the response
        user: { username: user?.username || "Anonymous" }, // Fallback to "Anonymous" if no username found
        comment: userReview,
      };

      setReviewsWithUsernames((prevReviews) => [...prevReviews, newReview]);
      setUserReview(""); // Reset the comment input
      setUserRating(5); // Reset the rating dropdown after submission
    } catch (error) {
      toast.error("Failed to submit review.");
    }
  };

  if (loading) return <ProductPagePlaceHolder />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const averageRating = calculateAverageRating(reviewsWithUsernames);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-6">
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-lg text-gray-600 mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="text-lg text-gray-600 mb-2"><strong>Brand:</strong> {product.brand || "N/A"}</p>
          <p className="text-lg text-gray-600 mb-4">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Select Size</h3>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border p-2 rounded-md text-center ${selectedSize === size ? "border-black font-bold" : "border-gray-300"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold !text-black-600 mb-4">
            {product.discounted_price && product.discounted_price < product.price ? (
              <>
                <span className="line-through text-gray-500 mr-2">Rs.{product.price}</span>
                <span className="text-red-500">Rs.{product.discounted_price}</span>
                <span className="ml-2 text-green-600 bg-green-100 px-2 py-1 rounded-md text-sm font-medium">
                  {`-${Math.round(((product.price - product.discounted_price) / product.price) * 100)}% off`}
                </span>
              </>
            ) : (
              `Rs.${product.price}`
            )}
          </p>
          {/* Stock Info */}
          <p className={`text-md font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-500"} mb-2`}>
            {product.stock_quantity > 0 ? `In stock: ${product.stock_quantity}` : "Out of Stock"}
          </p>

          {/* Average Rating */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Average Rating</h3>
            <p className="text-2xl text-yellow-500">
              {averageRating ? (
                <>
                  {renderStars(Number(averageRating))} {averageRating} ({averageRating} out of 5)
                </>
              ) : (
                "No ratings yet"
              )}
            </p>
          </div>

          <button
          onClick={add_item}
          disabled={inCart || product.stock_quantity === 0}
          className={`mt-4 font-bold py-2 px-4 rounded-lg transition 
            ${product.stock === 0 ? "bg-gray-400 cursor-not-allowed text-white" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
        >
          {product.stock_quantity === 0
            ? "Out of Stock"
            : inCart
            ? "Product added to Cart"
            : "Add to Cart"}
        </button>
        </div>
      </div>

      {/* Toggle Reviews */}
      <div className="mt-8">
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>
      </div>

      {/* Reviews Section */}
      {showReviews && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Previous Reviews</h3>
          {reviewsWithUsernames && reviewsWithUsernames.length > 0 ? (
            reviewsWithUsernames.map((review, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">{renderStars(Number(review.rating))} {review.rating}</span>
                  <span className="ml-2 text-gray-600">
                    by {review.username} {/* Display username dynamically */}
                  </span>
                  <span className="ml-2 text-gray-600">({review.rating} out of 5)</span>
                </div>
                <p className="text-gray-800">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      )}

      {/* Review Form */}
      {isAuthenticated && (
        <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Write a Review</h3>
          <form onSubmit={submitReview}>
            <label className="block text-gray-700 font-medium">Your Rating:</label>
            <select
              value={userRating}
              onChange={(e) => setUserRating(Number(e.target.value))}
              className="block w-full p-2 border rounded-lg my-2"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{num} ⭐</option>
              ))}
            </select>

            <label className="block text-gray-700 font-medium">Your Review:</label>
            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              className="block w-full p-2 border rounded-lg my-2"
              rows="3"
              placeholder="Share your experience..."
              required
            ></textarea>

            <button
              type="submit"
              className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}
      {/* Related Products */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">You Might Also Like</h3>
        {relatedProducts.length > 0 ? (
          <RelatedProducts products={relatedProducts} />
        ) : (
          <p className="text-gray-500">No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
