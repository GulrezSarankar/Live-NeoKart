// src/pages/admin/ForgotPassword.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminApiAxiosInstance from "../../api/adminaxios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await AdminApiAxiosInstance.post("/auth/forgot-password", { email });
      setMessage("✅ Reset link sent! Check your email.");
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Error sending reset link."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Forgot Password
        </h2>
        {message && <p className="text-center mb-3">{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded-lg p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </motion.form>
    </div>
  );
}
