import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, User, LogOut, LogIn, Search, Menu, X,
  Sun, Moon, ChevronDown, ChevronRight, Package, Store
} from "lucide-react";

export default function Navbar({ cartCount = 0 }) {
  const { user: currentUser, logout, userToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    axiosInstance.get("/products/categories-with-subcategories")
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Category error:", err));
  }, []);

  useEffect(() => {
    if (!currentUser || !userToken) return;
    axiosInstance.get("/orders/my")
      .then(res => setOrdersCount(res.data?.length || 0))
      .catch(err => console.error("Orders count error:", err));
  }, [currentUser, userToken]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b">
        <div className="max-w-7xl mx-auto flex justify-between px-4 py-3">
          <Link to="/" className="text-2xl font-bold">NeoKart</Link>

          <div className="hidden md:flex gap-4">
            <CategoryDropdown categories={categories} />
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <>
                <Link to="/cart"><ShoppingCart /></Link>
                <Link to="/orders"><Package /></Link>
              </>
            )}
            <ThemeToggle />
            {currentUser ? (
              <button onClick={logout}><LogOut /></button>
            ) : (
              <Link to="/login"><LogIn /></Link>
            )}
            <button onClick={() => setMenuOpen(true)} className="md:hidden">
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} setOpen={setMenuOpen} categories={categories} />
    </>
  );
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
};

const CategoryDropdown = ({ categories }) => (
  <div className="relative group">
    <button className="flex items-center gap-1">
      <Store /> Categories <ChevronDown size={16} />
    </button>
    <div className="absolute hidden group-hover:block bg-white shadow p-2">
      {categories.map(cat => (
        <Link
          key={cat.category}
          to={`/category/${encodeURIComponent(cat.category)}`}
          className="block px-2 py-1"
        >
          {cat.category}
        </Link>
      ))}
    </div>
  </div>
);

const MobileNav = ({ open, setOpen, categories }) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow z-50"
        >
          <button onClick={() => setOpen(false)} className="p-2"><X /></button>
          {categories.map(cat => (
            <button
              key={cat.category}
              className="block p-2"
              onClick={() => {
                navigate(`/category/${encodeURIComponent(cat.category)}`);
                setOpen(false);
              }}
            >
              {cat.category}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
