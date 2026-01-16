// src/pages/OrderSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // orderId passed from checkout page
  const orderId = location.state?.orderId || null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6"
      >
        <CheckCircle className="text-green-500 w-20 h-20" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-2 text-center"
      >
        🎉 Order Placed Successfully!
      </motion.h1>

      {/* Order details */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-gray-600 text-center mb-6"
      >
        {orderId ? (
          <>
            Your order <span className="font-semibold">#{orderId}</span> has
            been placed. <br />
            You’ll receive a confirmation email shortly.
          </>
        ) : (
          "Your order has been placed successfully!"
        )}
      </motion.p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition transform hover:scale-105"
        >
          View Orders
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition transform hover:scale-105"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
