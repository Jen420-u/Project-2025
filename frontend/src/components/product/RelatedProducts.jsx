import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BASE_URL } from "../../api";
import "./RelatedProducts.css";

const RelatedProducts = ({ products }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    checkScrollButtons();
    const handleScroll = () => checkScrollButtons();
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const checkScrollButtons = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      setCanScrollLeft(scrollContainer.scrollLeft > 0);
      setCanScrollRight(scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative related-products-container">
      <button
        className={`scroll-btn scroll-left ${!canScrollLeft ? "disabled" : ""}`}
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
      >
        &lt;
      </button>

      <div className="related-products-wrapper" ref={scrollContainerRef}>
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <a href={`/product/${product.slug}`} className="block">
              <img
                src={`${BASE_URL}${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="mt-2 text-center">
                <h4 className="text-xs font-semibold text-gray-800 truncate">{product.name}</h4>
                <p className="text-gray-600 text-xs mt-1">Rs.{Number(product.price).toFixed(2)}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      <button
        className={`scroll-btn scroll-right ${!canScrollRight ? "disabled" : ""}`}
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
      >
        &gt;
      </button>
    </div>
  );
};

RelatedProducts.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default RelatedProducts;
