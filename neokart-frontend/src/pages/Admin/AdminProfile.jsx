import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { User, Mail, Phone, Shield, Edit, KeyRound, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import AdminApiAxiosInstance from "../../api/adminaxios";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });

  // Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await AdminApiAxiosInstance.get("/admin");
        setProfile(res.data);
        setEditForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
        });
      } catch (err) {
        setError("⚠️ Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async () => {
    if (!editForm.name || !editForm.email) {
      return setMessage("❌ Name and Email are required");
    }
    try {
      const res = await AdminApiAxiosInstance.put("/admin", editForm);
      setProfile(res.data);
      setEditModal(false);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage("❌ Failed to update profile");
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      return setMessage("❌ Both old and new password are required");
    }
    try {
      await AdminApiAxiosInstance.put("/admin/change-password", passwordForm);
      setMessage("✅ Password updated successfully!");
      setPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage("❌ Failed to change password");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Sidebar Desktop */}
      <div className="hidden sm:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg sm:hidden"
      >
        <AdminSidebar />
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 w-full">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-white shadow hover:bg-gray-100 transition"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Admin Profile</h1>
        </div>

        {loading ? (
          <p className="text-gray-500 animate-pulse text-center mt-20">
            Loading profile...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center mt-20">{error}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Flash Message */}
            {message && (
              <div
                className={`mb-4 text-center p-2 rounded-lg ${
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Shield size={16} className="text-indigo-500" />
                    Administrator
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border shadow-sm">
                  <Mail className="text-blue-600" size={22} />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border shadow-sm">
                  <Phone className="text-green-600" size={22} />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border shadow-sm">
                  <User className="text-purple-600" size={22} />
                  <div>
                    <p className="text-xs text-gray-500">Admin ID</p>
                    <p className="font-medium text-gray-800">{profile.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border shadow-sm">
                  <Shield className="text-indigo-600" size={22} />
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-medium text-gray-800">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-start gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditModal(true)}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md"
                >
                  <Edit size={18} />
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPasswordModal(true)}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 shadow-md"
                >
                  <KeyRound size={18} />
                  Change Password
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button onClick={() => setEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <button
              onClick={handleUpdateProfile}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Change Password</h2>
              <button onClick={() => setPasswordModal(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Update Password
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
