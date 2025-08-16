import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  // Base API URL
  const API_URL = "http://localhost:4000/api/user";

  // Fetch profile data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in.");
      setLoading(false);
      return;
    }

    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error loading profile.");
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save updated profile
  const handleSave = () => {
    const token = localStorage.getItem("token");
    axios
      .put(API_URL, profile, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setProfile(res.data);
        setEditMode(false);
        setMessage("Profile updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to update profile.");
      });
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      {message && (
        <p
          className={`text-center mb-4 ${
            message.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
