import React, { useEffect, useState } from "react";
import AdminApiAxiosInstance from "../../api/adminaxios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserX, UserCheck, Key, X } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetUserId, setResetUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await AdminApiAxiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search users by email
  const handleSearch = async () => {
    if (!searchEmail) {
      fetchUsers();
      return;
    }
    try {
      const res = await AdminApiAxiosInstance.get(
        `/admin/users/search?email=${searchEmail}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // ✅ Toggle user status
  const toggleStatus = async (id) => {
    try {
      await AdminApiAxiosInstance.put(`/admin/users/${id}/toggle-status`);
      fetchUsers();
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  // ✅ Reset user password
  const resetPassword = async () => {
    if (!newPassword || !resetUserId) return;
    try {
      await AdminApiAxiosInstance.put(
        `/admin/users/${resetUserId}/reset-password?newPassword=${newPassword}`
      );
      alert("Password reset successfully!");
      setNewPassword("");
      setResetUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Reset password error:", err);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-0 sm:ml-64 p-4 sm:p-6 space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Search size={18} /> Search
          </button>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden sm:block bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user.id}
                    whileHover={{ scale: 1.01 }}
                    className="border-b"
                  >
                    <td className="p-3 border">{user.id}</td>
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.role}</td>
                    <td className="p-3 border">
                      {user.verified ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600 transition"
                      >
                        {user.verified ? <UserX size={16} /> : <UserCheck size={16} />}
                        {user.verified ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => setResetUserId(user.id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-purple-700 transition"
                      >
                        <Key size={16} /> Reset
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Users List - Mobile */}
        <div className="sm:hidden space-y-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-center">No users found</p>
          ) : (
            users.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-4 rounded-lg shadow space-y-2"
              >
                <p>
                  <span className="font-semibold">ID:</span> {user.id}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Role:</span> {user.role}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {user.verified ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    {user.verified ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => setResetUserId(user.id)}
                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Reset Password Modal */}
        <AnimatePresence>
          {resetUserId && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96 relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  onClick={() => setResetUserId(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold mb-4">Reset Password</h2>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border w-full px-3 py-2 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setResetUserId(null)}
                    className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={resetPassword}
                    className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
