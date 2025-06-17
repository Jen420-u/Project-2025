import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentStatusPage = ({ setNumberCartItems }) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSubMessage, setStatusSubMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const status = queryParams.get("status");
    const purchaseOrderId = queryParams.get("purchase_order_id");
    const pidx = queryParams.get("pidx");
    const totalAmount = queryParams.get("total_amount");

    console.log("Received Parameters:", { status, purchaseOrderId, pidx, totalAmount });

    if (!pidx || !purchaseOrderId) {
      setStatusMessage("Invalid Payment Data!");
      setStatusSubMessage("Missing necessary payment details.");
      setIsError(true);
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      const maxRetries = 3;
      let attempts = 0;
      let verified = false;
      let data;

      while (attempts < maxRetries && !verified) {
        try {
          const response = await fetch("http://127.0.0.1:8001/verify/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({ pidx, order_id: purchaseOrderId }),
          });

          data = await response.json();
          console.log(`Verification attempt ${attempts + 1}:`, data);

          if (response.ok && data.verified) {
            verified = true;
            break;
          }
        } catch (error) {
          console.error("Payment Verification Error:", error);
          // Don't break here; allow retrying
        }

        attempts++;
        // Wait 1.5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      if (verified) {
        setStatusMessage("Payment Successful!");
        setStatusSubMessage("Your payment has been verified successfully.");
        setIsError(false);
        localStorage.removeItem("cart_code");
        setNumberCartItems(0);
      } else {
        setStatusMessage("Payment Failed!");
        setStatusSubMessage(data?.error || "We were unable to verify your payment. Please contact support.");
        setIsError(true);
      }
      setLoading(false);
    };

    verifyPayment();
  }, [location.search, setNumberCartItems]);

  return (
    <header
      className="py-5"
      style={{
        backgroundColor: loading ? "#6050DC" : isError ? "#DC3545" : "#6050DC",
      }}
    >
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h2 className="display-4 fw-bold">
            {loading ? "Verifying your payment..." : statusMessage}
          </h2>
          <p className="lead fw-normal text-white-75 mb-4">
            {loading ? "Wait a moment, your payment is being verified!" : statusSubMessage}
          </p>

          {!loading && (
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
