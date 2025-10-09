// src/pages/PaymentSuccess.jsx
import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const paymentId = query.get("paymentId");
  const PayerID = query.get("PayerID");

  // TODO: call backend /api/paypal/execute?paymentId=...&PayerID=...
  // and then create order in DB

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-2xl font-bold text-green-600">
        ✅ Payment Successful! PaymentId: {paymentId}
      </h2>
    </div>
  );
}
