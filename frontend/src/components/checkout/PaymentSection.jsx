import { useState } from "react";
import styles from "./PaymentSection.module.css";
import api from "../../api";

const PaymentSection = () => {
  const cart_code = localStorage.getItem("cart_code");
  const [loading, setLoading] = useState(false);

  async function makePayment() {
    setLoading(true); 
    const token = localStorage.getItem("access"); 

    try {
      const res = await api.post("initiate/", { cart_code }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res.data);
      
      if (res.data.khalti_response?.payment_url) {
        window.location.href = res.data.khalti_response.payment_url; // Correct Khalti redirect
      } else {
        throw new Error("Invalid Khalti response");
      }
    } catch (err) {
      console.error(err.response?.data || "Unknown error");
      alert(err.response?.data?.error || "Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="col-md-4">
      <div className={`card ${styles.card}`}>
        <div className="card-header" style={{ backgroundColor: "#6050DC", color: "white" }}>
          <h5>Payment Options</h5>
        </div>
        <div className="card-body">
          <button 
            className={`btn btn-warning w-100 ${styles.khaltiButton}`} 
            id="khalti-button" 
            onClick={makePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : <><i className="bi bi-credit-card"></i> Pay with Khalti</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;