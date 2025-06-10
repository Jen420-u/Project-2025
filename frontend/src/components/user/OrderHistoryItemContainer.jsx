import OrderHistoryItem from "./OrderHistoryItem";

const OrderHistoryItemContainer = ({ orderitems }) => {
  return (
    <div className="container my-4">
      <div className="row" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <div className="col-md-12">
          <div className="card shadow-sm rounded-lg">
            <div
              className="card-header"
              style={{ backgroundColor: '#6050DC', color: 'white' }}
            >
              <h5 className="m-0">Order History</h5>
            </div>
            <div className="card-body">
              {orderitems && orderitems.length > 0 ? (
                orderitems.map(item => (
                  <OrderHistoryItem key={item.id} item={item} />
                ))
              ) : (
                <p className="text-muted">No orders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItemContainer;
