// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const paymentId = query.get("paymentId");
  const PayerID = query.get("PayerID");

  const [status, setStatus] = useState("processing");
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const executePayment = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.get(
          `${BASE_URL}/api/paypal/execute?paymentId=${paymentId}&PayerID=${PayerID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setStatus("success");
          setTimeout(() => {
            navigate("/order-success", { state: { orderId: res.data.orderId } });
          }, 2000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Payment execution failed:", error);
        setStatus("failed");
      }
    };

    if (paymentId && PayerID) {
      executePayment();
    } else {
      setStatus("failed");
    }
  }, [paymentId, PayerID, BASE_URL, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {status === "processing" && (
        <h2 className="text-xl font-semibold text-blue-600">
          ⏳ Verifying your payment...
        </h2>
      )}

      {status === "success" && (
        <h2 className="text-2xl font-bold text-green-600">
          ✅ Payment Successful! Creating your order...
        </h2>
      )}

      {status === "failed" && (
        <h2 className="text-2xl font-bold text-red-600">
          ❌ Payment verification failed. Please contact support.
        </h2>
      )}
    </div>
  );
}
