// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // preconfigured Axios with baseURL and JWT
import { toast, Toaster } from "react-hot-toast";
import { User, Phone, Lock, Save, UserCircle, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'password'

  const [loading, setLoading] = useState(true);
  const [isInfoSaving, setIsInfoSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/me");
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input changes
  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit personal info update
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setIsInfoSaving(true);
    const infoPromise = axiosInstance.put("/user/me", formData);

    toast.promise(infoPromise, {
      loading: 'Saving profile...',
      success: (res) => {
        setUser(res.data);
        setIsInfoSaving(false);
        return <b>Profile updated successfully!</b>;
      },
      error: (err) => {
        setIsInfoSaving(false);
        return <b>{err.response?.data?.message || "Failed to update profile."}</b>;
      },
    });
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsPasswordSaving(true);
    const passwordPromise = axiosInstance.put("/user/change-password", {
      currentPassword: passwords.current,
      newPassword: passwords.new,
    });

    toast.promise(passwordPromise, {
        loading: 'Updating password...',
        success: () => {
            setPasswords({ current: "", new: "", confirm: "" });
            setIsPasswordSaving(false);
            return <b>Password updated successfully!</b>;
        },
        error: (err) => {
            setIsPasswordSaving(false);
            return <b>{err.response?.data?.message || "Failed to update password."}</b>;
        }
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      </div>
    );
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile, address, and password.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Profile Card */}
            <div className="lg:col-span-1 lg:sticky top-8">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 text-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-800 dark:to-slate-900">
                <UserCircle className="w-24 h-24 mx-auto text-indigo-500" strokeWidth={1} />
                <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
                <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                 <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar size={16} />
                    <span>Joined September 2025</span>
                </div>
              </div>
            </div>

            {/* Form Section with Tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700">
                {/* Tab Navigation */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <nav className="flex space-x-2 px-4" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`relative px-3 py-4 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                    >
                      Profile
                      {activeTab === 'profile' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" layoutId="underline" />}
                    </button>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`relative px-3 py-4 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'password' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
                    >
                      Password
                      {activeTab === 'password' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" layoutId="underline" />}
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                      <motion.div
                        key="profile"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                      >
                        <form onSubmit={handleInfoSubmit} className="space-y-6">
                           <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Personal Information</h3>
                           {/* Name, Phone, Address fields */}
                           <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                              <div className="relative"><MapPin className="absolute left-3 top-4 w-5 h-5 text-slate-400" /><textarea name="address" value={formData.address} onChange={handleFormChange} rows="3" className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea></div>
                           </div>
                           <div className="flex justify-end">
                              <motion.button type="submit" disabled={isInfoSaving} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500" whileTap={{ scale: 0.95 }}><Save size={18} />{isInfoSaving ? "Saving..." : "Save Changes"}</motion.button>
                           </div>
                        </form>
                      </motion.div>
                    )}

                    {activeTab === 'password' && (
                      <motion.div
                        key="password"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                      >
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                           <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Change Password</h3>
                           {/* Password fields */}
                           <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} required placeholder="Enter your current password" className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} required placeholder="Enter a new password" className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} required placeholder="Confirm your new password" className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                           </div>
                           <div className="flex justify-end">
                              <motion.button type="submit" disabled={isPasswordSaving} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500" whileTap={{ scale: 0.95 }}><Save size={18} />{isPasswordSaving ? "Updating..." : "Update Password"}</motion.button>
                           </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserProfile;

