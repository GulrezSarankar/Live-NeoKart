import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle, XCircle, Eye, Filter, Search } from "lucide-react";

const BACKEND_URL = "http://localhost:4000";

const statusColors = {
  PROCESSING: "bg-yellow-100 text-yellow-700 border-yellow-300",
  CANCELLED: "bg-red-100 text-red-700 border-red-300",
  DELIVERED: "bg-green-100 text-green-700 border-green-300",
};

const statusIcons = {
  PROCESSING: <Truck className="w-5 h-5" />,
  CANCELLED: <XCircle className="w-5 h-5" />,
  DELIVERED: <CheckCircle className="w-5 h-5" />,
};

const timeOptions = [
  { label: "All", value: "ALL" },
  { label: "Last 3 Days", value: "3" },
  { label: "Last 5 Days", value: "5" },
  { label: "Last 1 Month", value: "30" },
];

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const ViewOrders = () => {
  const { user, userToken } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // 📦 Fetch Orders
  useEffect(() => {
    if (!user || !userToken) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, userToken, navigate]);

  // ❌ Cancel Order
  const handleCancelOrder = async (orderId, status) => {
    if (status === "DELIVERED") return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      alert("✅ Order cancelled successfully");
    } catch (err) {
      console.error("❌ Failed to cancel order:", err);
      alert(err.response?.data?.message || "❌ Failed to cancel order");
    }
  };

  // 🧠 Apply Filters + Search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (timeFilter !== "ALL") {
        const days = parseInt(timeFilter);
        const orderDate = new Date(order.createdAt);
        const diffDays = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > days) return false;
      }

      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        const matchOrderId = order.id.toString().includes(searchLower);
        const matchProduct = order.items?.some((item) =>
          item.product.name.toLowerCase().includes(searchLower)
        );
        if (!matchOrderId && !matchProduct) return false;
      }

      return true;
    });
  }, [orders, timeFilter, statusFilter, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-semibold animate-pulse text-gray-600">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4 bg-gray-50">
        <h2 className="text-2xl font-bold mb-3">No Orders Found 🛒</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven’t placed any orders yet. Start shopping now and enjoy great deals!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4 md:px-8">
      <h1 className="text-5xl text-bold font-extrabold mb-10 text-gray-800 text-center">
        My Orders
      </h1>

      {/* 🧭 Main Layout: Filter Left + Orders Right */}
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* 🧰 Left Filter Panel */}
        <div className="w-full md:w-72 bg-white p-5 rounded-2xl shadow-md border border-gray-100 h-fit">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg mb-4">
            <Filter className="w-5 h-5" /> Filters
          </div>

          {/* ⏱ Time Filter */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Time Filter
          </label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full mb-5 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {timeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 📦 Status Filter */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full mb-5 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 📦 Orders Section */}
        <div className="flex-1 space-y-8">
          {/* 🔍 Search Bar (TOP) */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          {/* 📦 Orders List */}
          <AnimatePresence>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        Order #{order.id}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Placed on:{" "}
                        <span className="font-medium text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        Total Amount:{" "}
                        <span className="font-semibold text-gray-800">
                          ₹{order.totalPrice}
                        </span>
                      </p>
                    </div>

                    <div className="mt-3 md:mt-0 flex items-center gap-2">
                      <span
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${statusColors[order.status]}`}
                      >
                        {statusIcons[order.status]} {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-4 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items?.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition"
                      >
                        <img
                          src={`${BACKEND_URL}${item.product.imageUrl}`}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-base">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            ₹{item.product.price} × {item.quantity}
                          </p>
                          <p className="text-gray-800 text-sm font-semibold mt-1">
                            Subtotal: ₹{item.product.price * item.quantity}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col md:flex-row justify-end gap-3">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-md"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <button
                      onClick={() => handleCancelOrder(order.id, order.status)}
                      disabled={order.status === "DELIVERED"}
                      className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-white transition transform hover:scale-105 shadow-md ${
                        order.status === "DELIVERED"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500 font-medium">
                ❌ No orders match your filters.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
