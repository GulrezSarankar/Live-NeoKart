import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileModal = ({ user, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await axiosInstance.put("/api/user/me", {
        name: formData.name,
        phone: formData.phone,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed! Check your current password.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
