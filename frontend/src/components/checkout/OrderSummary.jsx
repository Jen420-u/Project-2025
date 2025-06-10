/* eslint-disable react/prop-types */
import OrderItem from "./OrderItem";
import styles from "./OrderSummary.module.css";

const OrderSummary = ({ cartitems, cartTotal, tax }) => {
  
  // Calculate the total using discounted prices
  const discountedTotal = cartitems.reduce((acc, cartitem) => {
    let price = cartitem.product.price;

    // Apply discount if the product is on sale
    if (cartitem.product.is_on_sale && cartitem.product.discount_percent > 0) {
      const discountAmount = (cartitem.product.discount_percent / 100) * price;
      price -= discountAmount;
    }

    return acc + price * cartitem.quantity;
  }, 0);

  const total = (discountedTotal + tax).toFixed(2);

  return (
    <div className="col-md-8">
      <div className={`card mb-4 ${styles.card}`}>
        <div className="card-header" style={{ backgroundColor: '#6050DC', color: "white" }}>
          <h5>Order Summary</h5>
        </div>
        <div className="card-body">
          <div className='px-3' style={{ height: "300px", overflow: "auto" }}>
            {cartitems.map(cartitem =>  
              <OrderItem key={cartitem.id} cartitem={cartitem} />
            )}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{`Rs.${total}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
