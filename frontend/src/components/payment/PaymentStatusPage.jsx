import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentStatusPage = ({ setNumberCartItems }) => {
  const [statusMessage, setStatusMessage] = useState("Verifying your payment...");
  const [statusSubMessage, setStatusSubMessage] = useState("Wait a moment, your payment is being verified!");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Extract necessary parameters from the query string
    const status = queryParams.get("status"); // "Completed" or "Failed"
    const purchaseOrderId = queryParams.get("purchase_order_id"); // Order ID
    const pidx = queryParams.get("pidx"); // Khalti transaction ID
    const totalAmount = queryParams.get("total_amount"); // Total amount

    console.log("Received Parameters:", { status, purchaseOrderId, pidx, totalAmount });

    if (!pidx || !purchaseOrderId) {
      setStatusMessage("Invalid Payment Data!");
      setStatusSubMessage("Missing necessary payment details.");
      setIsError(true);
      setLoading(false);
      return;
    }

    // Send Request to Backend for Verification
    const verifyPayment = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8001/verify/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Adjust based on auth method
          },
          body: JSON.stringify({ pidx, order_id: purchaseOrderId }),
        });

        const data = await response.json();
        console.log("Verification Response:", data);

        if (response.ok && data.verified) {
          setStatusMessage("Payment Successful!");
          setStatusSubMessage("Your payment has been verified successfully.");
          setIsError(false);
          localStorage.removeItem("cart_code");
          setNumberCartItems(0);
        } else {
          setStatusMessage("Payment Failed!");
          setStatusSubMessage(data.error || "We were unable to verify your payment. Please contact support.");
          setIsError(true);
        }
      } catch (error) {
        console.error("Payment Verification Error:", error);
        setStatusMessage("Payment Error!");
        setStatusSubMessage("Something went wrong while verifying the payment.");
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, setNumberCartItems]);

  return (
    <header className="py-5" style={{ backgroundColor: isError ? "#DC3545" : "#6050DC" }}>
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h2 className="display-4 fw-bold">{statusMessage}</h2>
          <p className="lead fw-normal text-white-75 mb-4">{statusSubMessage}</p>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="d-flex justify-content-center gap-3">
              <Link to="/profile" className="btn btn-light px-3 py-2">
                View Order Details
              </Link>
              <Link to="/" className="btn btn-light px-3 py-2">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PaymentStatusPage;
