import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/user/me");
      setUser(res.data);
      setFormData({ name: res.data.name, phone: res.data.phone || "" });
      setError(null);
    } catch (err) {
      setError("Failed to load user data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await axiosInstance.put("/api/user/me", formData);
      setSuccessMsg("Profile updated successfully!");
      fetchUser();
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Email (cannot change)</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
      </form>
    </div>
  );
}
