// src/pages/VerifyOtp.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { ShieldCheck } from "lucide-react";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if opened directly without data
  useEffect(() => {
    if (!phone && !email) {
      navigate("/register");
    }
  }, [phone, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        phone,
        otp,
      });

      if (res.data?.success) {
        setSuccess(res.data.message || "OTP verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed!");
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axiosInstance.post(`/auth/send-otp/${phone}`);
      alert(res.data?.message || "OTP resent successfully!");
    } catch {
      alert("Failed to resend OTP!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <ShieldCheck className="text-green-600 mb-3" size={40} />
          <h2 className="text-3xl font-bold text-green-700">Verify OTP</h2>
          <p className="text-gray-500 mt-2">
            OTP sent to <b>{phone || email}</b>
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-3 border rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
          >
            Verify OTP
          </button>
        </form>

        <p
          className="text-center text-sm mt-4 text-green-600 hover:underline cursor-pointer"
          onClick={resendOtp}
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}
