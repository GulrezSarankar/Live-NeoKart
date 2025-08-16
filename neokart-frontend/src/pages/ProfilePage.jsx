import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      <div className="flex flex-col items-center mb-6">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Name:</label>
          <p>{user.name}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Phone:</label>
          <p>{user.phone || "-"}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email:</label>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/profile/edit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
