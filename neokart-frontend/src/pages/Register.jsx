// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle text inputs (name, email, password)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle phone with country code auto
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: `+${value}` });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("📤 Sending data:", formData);

    try {
      const res = await axiosInstance.post("/auth/register", formData);

      if (res.data.success) {
        setSuccess(res.data.message || "Registration successful!");

        // ✅ Redirect to OTP verification page with phone + email
        setTimeout(() => {
          navigate("/verify-otp", {
            state: { email: res.data.email, phone: res.data.phone },
          });
        }, 1500);
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md hover:shadow-3xl transition duration-500">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Create Account
        </h2>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4 animate-pulse">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Country-wise phone input */}
          <PhoneInput
            country={"in"}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{
              width: "100%",
              height: "48px",
              borderRadius: "12px",
              border: "1px solid #ccc",
            }}
            buttonStyle={{ borderRadius: "12px 0 0 12px" }}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-10"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
