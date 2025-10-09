// src/pages/Admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import AdminApiAxiosInstance from "../../api/adminaxios";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import toast from "react-hot-toast";

const statuses = ["PROCESSING", "SHIPPED", "DELIVERED"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Local image helper
  const getImageUrl = (filename) => {
    if (!filename) return "/placeholder.png";
    if (filename.startsWith("http")) return filename;
    return `http://localhost:4000${filename}`;
  };

  // Track screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await AdminApiAxiosInstance.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("⚠️ Failed to fetch orders!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      toast.loading("Updating status...", { id: "update" });

      // Optimistic UI
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      await AdminApiAxiosInstance.post("/orders/update-status", null, {
        params: { orderId, newStatus },
      });

      toast.success("✅ Status updated successfully!", { id: "update" });
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("⚠️ Failed to update status!", { id: "update" });

      // Revert UI
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  // Expand / collapse
  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Search + filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "ALL" ? true : order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-semibold animate-pulse text-gray-700">
          Loading Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          All Orders
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID, User name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
          >
            <option value="ALL">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Orders */}
        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrders.includes(order.id) || !isMobile;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white shadow-md rounded-xl p-4 sm:p-6 hover:shadow-xl transition"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                      <div>
                        <h2 className="text-gray-800 font-semibold text-base sm:text-lg">
                          Order #{order.id}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {order.user?.name} ({order.user?.email})
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Invalid Date"}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {isMobile && (
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
                          >
                            {isExpanded ? (
                              <>
                                Hide <ChevronUp size={16} />
                              </>
                            ) : (
                              <>
                                Details <ChevronDown size={16} />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 border-t pt-4 space-y-3"
                        >
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition"
                            >
                              <img
                                src={getImageUrl(item.product?.imageUrl)}
                                alt={item.product?.name}
                                className="w-16 h-16 object-contain rounded-lg border"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium text-sm text-gray-800 break-words">
                                  {item.product?.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-800">
                                ₹{item.price}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center py-6">No orders found.</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
