import PropTypes from "prop-types";
import api, { BASE_URL } from "../../api";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  setCartTotal,
  setCartItems,
  cartitems,
  setNumberCartItems,
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const itemID = { item_id: item.id };

  // Function to delete item from cart
  function deleteCartitem() {
    const confirmDelete = window.confirm("Are you sure you want to delete this cart item?");
    if (confirmDelete) {
      api.post("delete_cartitem/", itemID)
        .then((res) => {
          toast.success("Cart item deleted successfully");

          setCartItems((prevState) => {
            const updatedCart = prevState.filter(cartitem => cartitem.id !== item.id);
            setCartTotal(updatedCart.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0));
            setNumberCartItems(updatedCart.reduce((acc, curr) => acc + curr.quantity, 0));
            return updatedCart;
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to delete cart item.");
        });
    }
  }

  // Function to update quantity
  const updateCartItem = () => {
    // Validate quantity before request
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      toast.error("Please enter a valid quantity greater than 0");
      return;
    }

    setLoading(true);
    const itemData = { quantity: Number(quantity), item_id: item.id };

    api.patch("update_quantity/", itemData)
      .then((res) => {
        setLoading(false);
        toast.success("Cart item updated successfully!");

        // Update state
        setCartItems((prevState) => {
          const updatedCart = prevState.map((cartitem) =>
            cartitem.id === item.id ? { ...cartitem, ...res.data.data } : cartitem
          );

          setCartTotal(
            updatedCart.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0)
          );
          setNumberCartItems(
            updatedCart.reduce((acc, curr) => acc + curr.quantity, 0)
          );

          return updatedCart;
        });
      })
      .catch((err) => {
        console.error(err);
        const errorMsg = err.response?.data?.error || "Failed to update cart item!";
        toast.error(errorMsg);
        setLoading(false);
      });
  };

  // Product price calculation
  const { is_on_sale, discount_percent, price } = item.product;
  const discountedPrice = price && is_on_sale
    ? price - (price * discount_percent) / 100
    : price || 0;

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-white rounded-lg shadow-md">
      {/* Product Image */}
      <img
        src={`${BASE_URL}${item.product.image}`}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Product Details */}
      <div className="flex-1 ml-3">
        <h3 className="text-md font-semibold">{item.product.name}</h3>
        <p className="text-gray-500 text-sm">
          {is_on_sale ? (
            <>
              <span className="line-through text-red-500">Rs.{price}</span>&nbsp;
              <span className="text-green-500 font-bold">Rs.{discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            `Rs.${price}`
          )}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              if (quantity > 1) {
                setQuantity(prev => prev - 1);
                onDecrease(item.id);
              }
            }}
            className="w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1) setQuantity(value);
            }}
            className="w-12 text-center border border-gray-300 rounded-md"
          />
          <button
            onClick={() => {
              setQuantity(prev => prev + 1);
              onIncrease(item.id);
            }}
            className="w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Update Button */}
        <button
          onClick={updateCartItem}
          disabled={loading}
          className={`px-4 py-1 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update"}
        </button>

        {/* Delete Button */}
        <button
          onClick={deleteCartitem}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      is_on_sale: PropTypes.bool.isRequired,
      discount_percent: PropTypes.number,
    }).isRequired,
  }).isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
  setCartTotal: PropTypes.func.isRequired,
  cartitems: PropTypes.array.isRequired,
  setNumberCartItems: PropTypes.func.isRequired,
  setCartItems: PropTypes.func.isRequired,
};

export default CartItem;
