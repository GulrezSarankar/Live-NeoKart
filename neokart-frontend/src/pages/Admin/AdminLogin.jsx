import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import AdminApiAxiosInstance from "../../api/adminaxios";

// Reusable Input Field Component
const InputField = ({ icon, type, placeholder, value, onChange, children }) => (
  <div className="relative mb-4">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-700/50 text-gray-200 border border-gray-600 rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      required
    />
    {children}
  </div>
);

// Main AdminLogin Component
export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await AdminApiAxiosInstance.post("/auth/admin/login", formData);
      const token = res.data?.token || res.data;
      if (!token) throw new Error("Invalid login response from server");

      localStorage.setItem("token", token);
      login(token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login failed:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200v20M0%2020h20%22%20fill%3D%22none%22%20stroke%3D%22%23555%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')]"></div>
      
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <Link to="/" className="inline-block text-3xl font-bold tracking-wide text-white hover:text-blue-400 transition-colors">
            🛒 NeoKart
          </Link>
          <h2 className="text-2xl font-semibold mt-2 text-gray-300">
            Admin Panel
          </h2>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 flex items-center text-sm"
            >
              <AlertTriangle size={18} className="mr-3 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <motion.div variants={itemVariants}>
            <InputField
              icon={<Mail size={20} />}
              type="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <InputField
              icon={<Lock size={20} />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            >
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputField>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3 rounded-lg flex justify-center items-center transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Login"}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}