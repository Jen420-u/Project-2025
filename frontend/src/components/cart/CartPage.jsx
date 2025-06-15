import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import Spinner from "../ui/Spinner";
import useCartData from "../../hooks/useCartData";

const CartPage = ({ setNumberCartItems }) => {
  const { cartitems, setCartItems, cartTotal, setCartTotal, loading, tax } = useCartData();

  // Function to handle increasing quantity (optional customization)
  const handleIncrease = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to handle decreasing quantity
  const handleDecrease = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (cartitems.length < 1) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div
          className="bg-blue-100 text-blue-800 px-6 py-4 rounded-lg shadow-md alert alert-primary my-5"
          role="alert"
        >
          <p className="text-lg font-semibold">🛒 Your cart is empty!</p>
          <p className="text-sm text-gray-600 mt-1">Start shopping now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6">Shopping Cart</h5>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-4 overflow-y-auto max-h-[70vh]">
          {cartitems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              cartitems={cartitems}
              setCartItems={setCartItems}
              setCartTotal={setCartTotal}
              setNumberCartItems={setNumberCartItems}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ))}
        </div>

        <CartSummary
          cartTotal={cartitems.reduce((acc, curr) => {
            const price = curr.product.is_on_sale
              ? curr.product.price * (1 - curr.product.discount_percent / 100)
              : curr.product.price;
            return acc + price * curr.quantity;
          }, 0)}
          tax={tax}
        />
      </div>
    </div>
  );
};

export default CartPage;
