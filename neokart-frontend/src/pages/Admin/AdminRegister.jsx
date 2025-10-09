import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAxios from "../../api/adminaxios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await adminAxios.post("/auth/admin/register", formData);
      setSuccess("Admin registered successfully!");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-96"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          Admin Register
        </h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-center">{success}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-lg p-3 mb-4"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-4"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border rounded-lg p-3 mb-4"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 flex justify-center items-center"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Register"}
        </button>

        {/* Back to Login link */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </motion.form>
    </div>
  );
}
