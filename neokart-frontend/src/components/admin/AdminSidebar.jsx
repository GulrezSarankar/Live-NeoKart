import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminApiAxiosInstance from "../../api/adminaxios";
import {
  LayoutDashboard,
  Box,
  Users,
  ClipboardList,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  PackagePlus,
  ShoppingBag,
  ListChecks,
  // FileText,
  Settings,
  Logs,
  Settings2, // ✅ Added for Audit Logs
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Products",
    icon: Box,
    basePath: "/admin/products",
    children: [
      { to: "/admin/products", label: "All Products", icon: ClipboardList },
      { to: "/admin/addProduct", label: "Add New", icon: PackagePlus },
      { to: "/admin/bulk-upload", label: "Bulk Upload", icon: ListChecks },
    ],
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    basePath: "/admin/orders",
    children: [
      { to: "/admin/orders", label: "All Orders", icon: ListChecks },
      {
        to: "/admin/orders/details",
        label: "View Order Details",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    basePath: "/admin/orders",
    children: [
      { to: "/admin/Settings", label: "Settings", icon: Settings },
      { to: "/admin/users", label: "Manage Users", icon: Users },
      { to: "/admin/audit-logs", label: "Audit Logs", icon: Logs },
      { to: "/admin/settings", label: " Admin Settings", icon: Settings2 },
    ],
  },

  // { to: "/admin/users", label: "Manage Users", icon: Users },

  // ✅ New Audit Log Section
  // { to: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
];

const NavItem = ({ item, isCollapsed, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isParentActive =
    item.basePath && location.pathname.startsWith(item.basePath);

  useEffect(() => {
    if (isParentActive) setIsOpen(true);
  }, [isParentActive]);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
            isParentActive
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
          {!isCollapsed && (
            <ChevronLeft
              size={16}
              className={`transition-transform ${isOpen ? "-rotate-90" : ""}`}
            />
          )}
        </button>

        <AnimatePresence>
          {isOpen && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-8 pt-2 flex flex-col items-start"
            >
              {item.children.map((child) => {
                const isActive = location.pathname === child.to;
                return (
                  <Link
                    key={child.to}
                    to={child.to}
                    className={`flex items-center gap-3 py-2 px-3 rounded-md text-sm transition-colors w-full ${
                      isActive
                        ? "bg-indigo-500 text-white font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <child.icon size={16} />
                    <span>{child.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isActive = location.pathname === item.to;
  return (
    <Link
      to={item.to}
      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-600 text-white font-semibold"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <item.icon size={20} />
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
};

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    AdminApiAxiosInstance.get("/admin")
      .then((res) => setAdminName(res.data?.name || "Admin"))
      .catch(() => setAdminName("Admin"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        } p-4 border-b border-gray-700 h-[68px]`}
      >
        {!isCollapsed && (
          <h1 className="font-bold text-xl text-white tracking-wide">
            NeoKart Admin
          </h1>
        )}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            isCollapsed={isCollapsed}
            location={location}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/admin/profile"
          className={`flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-700 mb-2 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="font-semibold text-white text-sm truncate">
                {adminName}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 w-full p-3 rounded-lg transition-colors text-red-500 hover:bg-red-500/10 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-white p-2 rounded-md shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-72 h-screen bg-gray-800 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 h-screen bg-gray-800 text-gray-300 flex-col transition-all duration-300 ${
          isCollapsed ? "w-24" : "w-72"
        }`}
      >
        <div className="flex-grow flex flex-col">
          <SidebarContent />
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center gap-4 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <ChevronLeft
              size={20}
              className={`transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
