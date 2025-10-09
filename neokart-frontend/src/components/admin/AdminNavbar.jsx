// src/components/admin/AdminNavbar.jsx
import React from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { Bell, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminNavbar() {
  const { adminInfo, logoutAdmin } = useAdminAuth();

  return (
    <header className="w-full bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded bg-gray-100">☰</button>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="notifications"
        >
          <Bell size={18} />
        </motion.button>

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="text-right">
            <div className="text-sm font-medium">{adminInfo?.name || adminInfo?.email || "Admin"}</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>

          <motion.button
            onClick={logoutAdmin}
            whileHover={{ scale: 1.03 }}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Logout"
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
