// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import { User, Phone, Lock, Save, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/me");
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          currentPassword: "",
          newPassword: "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
    };

    if (formData.currentPassword && formData.newPassword) {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    try {
      const res = await axiosInstance.put("/user/me", payload);
      setUser(res.data);
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="min-h-screen bg-gray-50 p-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <UserCircle className="w-24 h-24 mx-auto text-blue-500" />
              <h2 className="mt-3 font-semibold text-lg">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="md:col-span-2 bg-white p-6 rounded-xl shadow space-y-6"
            >
              <h2 className="text-xl font-semibold">Personal Info</h2>

              <div>
                <label className="block mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full border p-2 rounded"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold">Change Password</h2>

              <div>
                <label className="block mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="pl-10 w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="pl-10 w-full border p-2 rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
              >
                <Save size={18} />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserProfile;
