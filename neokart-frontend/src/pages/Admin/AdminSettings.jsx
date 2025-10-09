import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [theme, setTheme] = useState("light");
  const [stripeKey, setStripeKey] = useState("");
  const [twilioSID, setTwilioSID] = useState("");
  const [smtpServer, setSmtpServer] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleSave = (field) => {
    toast.success(`${field} settings saved ✅`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-5 text-2xl font-bold border-b border-gray-700">
          🛒 NeoKart Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800"
          >
            <Package size={18} /> Products
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800"
          >
            <ShoppingCart size={18} /> Orders
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 p-2 rounded-md bg-gray-800"
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          ⚙️ Admin Settings
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Gateway */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Payment Gateway (Stripe)
            </h2>
            <input
              type="text"
              placeholder="Enter Stripe API Key"
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
              className="w-full border p-2 rounded-md mb-2"
            />
            <button
              onClick={() => handleSave("Stripe")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>

          {/* Twilio OTP */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Twilio OTP Settings
            </h2>
            <input
              type="text"
              placeholder="Enter Twilio SID"
              value={twilioSID}
              onChange={(e) => setTwilioSID(e.target.value)}
              className="w-full border p-2 rounded-md mb-2"
            />
            <button
              onClick={() => handleSave("Twilio")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>

          {/* Email Server */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Email Server (SMTP)
            </h2>
            <input
              type="text"
              placeholder="SMTP Server Address"
              value={smtpServer}
              onChange={(e) => setSmtpServer(e.target.value)}
              className="w-full border p-2 rounded-md mb-2"
            />
            <button
              onClick={() => handleSave("SMTP")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>

          {/* Theme Mode */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Theme Mode
            </h2>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border p-2 rounded-md w-full mb-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <button
              onClick={() => handleSave("Theme")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
