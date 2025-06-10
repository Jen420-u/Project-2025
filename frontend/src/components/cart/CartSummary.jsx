/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const CartSummary = ({ cartTotal, tax }) => {
  const subTotal = cartTotal.toFixed(2);
  const cartTax = tax.toFixed(2);
  const total = (cartTotal + tax).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Sub Total:</span>
          <span className="text-sm">{`Rs.${subTotal}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Tax:</span>
          <span className="text-sm">{`Rs.${cartTax}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Total Price</span>
          <span className="text-sm font-semibold">{`Rs.${total}`}</span>
        </div>
        <div className="mt-4">
          <Link to="/checkout">
            <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
