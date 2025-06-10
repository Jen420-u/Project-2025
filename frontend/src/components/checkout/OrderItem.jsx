/* eslint-disable react/prop-types */
import { BASE_URL } from "../../api";

const OrderItem = ({ cartitem }) => {
  const { product, quantity } = cartitem;

  // Calculate discounted price
  const price = product.price;
  const discountAmount = product.is_on_sale ? (product.discount_percent / 100) * price : 0;
  const discountedPrice = price - discountAmount;

  return (
    <div className="flex justify-between items-center mb-3 p-3 border-b border-gray-200">
      <div className="flex items-center">
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md"
        />
        <div className="ml-3">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600">Quantity: {quantity}</p>
          {product.is_on_sale && (
            <p className="text-sm text-red-500 font-semibold">
              {product.discount_percent}% Off!
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        {product.is_on_sale ? (
          <>
            <p className="text-red-500 font-semibold">{`Rs.${discountedPrice}`}</p>
            <p className="text-gray-400 line-through text-sm">{`Rs.${product.price ? product.price : "N/A"}`}</p>
          </>
        ) : (
          <p className="text-lg font-semibold">{`Rs.${product.price ? product.price : "N/A"}`}</p>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
