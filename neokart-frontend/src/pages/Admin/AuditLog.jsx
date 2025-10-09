import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Activity,
  Menu,
  ShieldCheck,
  Edit3,
  Trash2,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminApiAxiosInstance from "../../api/adminaxios";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch all audit logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await AdminApiAxiosInstance.get("/admin/audit");
        setLogs(res.data.reverse());
      } catch (err) {
        setError("⚠️ Failed to load audit logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // ✅ Filter logs by search
  const filteredLogs = logs.filter(
    (log) =>
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Choose icon based on action type
  const getActionIcon = (action) => {
    if (!action) return <Activity size={18} className="text-gray-400" />;
    const lower = action.toLowerCase();
    if (lower.includes("delete")) return <Trash2 size={18} className="text-red-600" />;
    if (lower.includes("update") || lower.includes("edit"))
      return <Edit3 size={18} className="text-yellow-600" />;
    if (lower.includes("add") || lower.includes("create"))
      return <PlusCircle size={18} className="text-green-600" />;
    if (lower.includes("login") || lower.includes("security"))
      return <ShieldCheck size={18} className="text-indigo-600" />;
    return <Activity size={18} className="text-gray-500" />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* ✅ Sidebar for large screens */}
      <div className="hidden lg:block w-64">
        <AdminSidebar />
      </div>

      {/* ✅ Overlay when sidebar open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Mobile Sidebar Animation */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg lg:hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-gray-700 text-lg">Admin Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} className="text-gray-600" />
          </button>
        </div>
        <AdminSidebar />
      </motion.div>

      {/* ✅ Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
        {/* Header (with menu on mobile) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md bg-white shadow lg:hidden hover:bg-gray-100 transition"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-2">
              <Activity className="text-indigo-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            </div>
          </div>

          {/* Search input */}
          <div className="relative hidden sm:block w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search actions or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative mb-4 sm:hidden">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* ✅ Loading / Error / Table */}
        {loading ? (
          <p className="text-gray-500 animate-pulse text-center mt-20">
            Loading logs...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center mt-20">{error}</p>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <Activity className="mx-auto mb-2 text-gray-400" size={40} />
            No audit logs found.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-3 px-4 sm:px-6 font-medium text-sm">#</th>
                    <th className="py-3 px-4 sm:px-6 font-medium text-sm">Action</th>
                    <th className="py-3 px-4 sm:px-6 font-medium text-sm">Performed By</th>
                    <th className="py-3 px-4 sm:px-6 font-medium text-sm">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr
                      key={log.id || index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="py-3 px-4 sm:px-6 text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 sm:px-6 text-gray-800 flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="truncate max-w-[160px] sm:max-w-none">{log.action}</span>
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-gray-700 truncate max-w-[120px] sm:max-w-none">
                        {log.performedBy}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-gray-500 flex items-center gap-2">
                        <Clock size={16} className="text-indigo-500" />
                        <span className="truncate">{new Date(log.timestamp).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
