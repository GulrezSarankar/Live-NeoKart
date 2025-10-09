import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = reset password
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendOtp = async () => {
    setError(null);
    setMessage(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown}s before resending OTP.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP sent successfully to your registered phone.");
        setStep(2);
        setResendCooldown(30);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    setError(null);
    setMessage(null);

    if (otp.length !== 6) {
      setError("OTP should be 6 digits.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Password reset successfully! Please login with your new password.");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        navigate("/login"); // redirect to login page after success
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your registered email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={sendOtp}
            disabled={loading || resendCooldown > 0}
            className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))} // only digits
            className="border p-2 rounded w-full mb-4"
          />
          <input
            type="password"
            placeholder="Enter new password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={resetPassword}
            disabled={loading}
            className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
}
