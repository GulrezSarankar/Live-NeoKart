// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Package,
  Store,
} from "lucide-react";

// --- Main Navbar Component ---
export default function Navbar({ cartCount = 0 }) {
  const { user: currentUser, logout, userToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  // --- Data Fetching Logic (Unchanged) ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/products/categories-with-subcategories");
        const cleanData = res.data.map((cat) => ({
          ...cat,
          subCategories: (cat.subCategories || []).filter((s) => s !== null),
        }));
        setCategories(cleanData);
      } catch (err) { console.error("Error fetching categories:", err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!currentUser || !userToken) return;
    const fetchOrdersCount = async () => {
      try {
        const res = await axiosInstance.get("/orders/my", {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setOrdersCount(res.data?.length || 0);
      } catch (err) { console.error("Failed to fetch orders count:", err); }
    };
    fetchOrdersCount();
  }, [currentUser, userToken]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 h-16">
          {/* Left Section: Logo & Categories */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Neo<span className="text-indigo-600">Kart</span>
            </Link>
            <div className="hidden lg:flex items-center gap-4">
              <CategoryDropdown categories={categories} />
            </div>
          </div>

          {/* Center Section: Search Bar */}
          <div className="hidden md:flex flex-grow max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <DesktopNavActions
                currentUser={currentUser}
                cartCount={cartCount}
                ordersCount={ordersCount}
                logout={logout}
              />
            </div>
            <button
              className="md:hidden p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} className="text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav
        isOpen={menuOpen}
        setIsOpen={setMenuOpen}
        categories={categories}
        currentUser={currentUser}
        cartCount={cartCount}
        logout={logout}
      />
    </>
  );
}

// --- Desktop Navigation Actions ---
const DesktopNavActions = ({ currentUser, cartCount, ordersCount, logout }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const getDisplayName = () => currentUser?.username || currentUser?.name || "User";
  const goToCart = () => (currentUser ? navigate("/cart") : navigate("/login"));

  return (
    <>
      {currentUser && (
        <>
          <IconButton onClick={goToCart} count={cartCount}>
            <ShoppingCart size={22} />
          </IconButton>
          <IconButton as={Link} to="/orders" count={ordersCount}>
            <Package size={22} />
          </IconButton>
        </>
      )}
      <IconButton onClick={toggleTheme}>
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} className="text-yellow-400" />}
      </IconButton>
      {currentUser ? (
        <UserMenu displayName={getDisplayName()} logout={logout} />
      ) : (
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <LogIn size={18} /> Login
        </Link>
      )}
    </>
  );
};

// --- Mobile Navigation Drawer ---
const MobileNav = ({ isOpen, setIsOpen, categories, currentUser, cartCount, logout }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const closeAndGo = (path) => {
      setIsOpen(false);
      navigate(path);
    };
  
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white dark:bg-slate-900 shadow-xl z-50 md:hidden flex flex-col text-slate-800 dark:text-slate-200"
            >
              <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={24} /></button>
              </div>
              
              <div className="p-4 flex-grow overflow-y-auto">
                <SearchBar onSearch={() => setIsOpen(false)} />
                
                <nav className="mt-6 space-y-2">
                  <h3 className="px-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">Categories</h3>
                  {categories.map(cat => <MobileCategoryItem key={cat.category} category={cat} onNavigate={() => setIsOpen(false)} />)}
                </nav>
  
                <div className="border-t border-slate-200 dark:border-slate-800 my-6"></div>
  
                {currentUser ? (
                  <nav className="space-y-2">
                    <MobileNavLink icon={<User size={20}/>} onClick={() => closeAndGo('/profile')}>My Profile</MobileNavLink>
                    <MobileNavLink icon={<Package size={20}/>} onClick={() => closeAndGo('/orders')}>My Orders</MobileNavLink>
                    <MobileNavLink icon={<ShoppingCart size={20}/>} onClick={() => closeAndGo('/cart')}>Cart ({cartCount})</MobileNavLink>
                  </nav>
                ) : (
                  <MobileNavLink icon={<LogIn size={20}/>} onClick={() => closeAndGo('/login')}>Login / Sign Up</MobileNavLink>
                )}
              </div>
  
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button onClick={toggleTheme} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                  <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                </button>
                {currentUser && (
                    <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-3 w-full p-2 rounded-md text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <LogOut size={20}/>
                        <span>Logout</span>
                    </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
};

// --- Helper & UI Components ---

const SearchBar = ({ onSearch = () => {} }) => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const searchRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) setSuggestions([]);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    const handleSearch = (e) => {
      e.preventDefault();
      if (!search.trim()) return;
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch(""); setSuggestions([]); onSearch();
    };
  
    const fetchSuggestions = async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axiosInstance.get(`/products/search?q=${query}`);
        setSuggestions(res.data.slice(0, 5));
      } catch (err) { console.error("Search error:", err); }
    };
    
    return (
      <form onSubmit={handleSearch} className="relative w-full" ref={searchRef}>
        <input
          type="text" value={search}
          onChange={(e) => { setSearch(e.target.value); fetchSuggestions(e.target.value); }}
          placeholder="Search for products..."
          className="w-full pl-5 pr-12 py-2.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
        />
        <button type="submit" className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors">
          <Search size={20} />
        </button>
        <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
          >
            {suggestions.map((s) => (
              <Link key={s.id || s._id} to={`/product/${s.id || s._id}`}
                className="block px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => {setSuggestions([]); setSearch(""); onSearch();}}>
                {s.name}
              </Link>
            ))}
          </motion.div>
        )}
        </AnimatePresence>
      </form>
    );
};

const CategoryDropdown = ({ categories }) => (
    <div className="relative group">
      <button className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <Store size={20} /> Categories <ChevronDown size={16} />
      </button>
      <div className="absolute left-0 mt-3 w-64 p-2 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
        {categories.map((cat) => (
          <div key={cat.category} className="relative group/sub">
            <Link to={`/category/${encodeURIComponent(cat.category)}`} className="flex justify-between items-center w-full px-3 py-2 text-sm rounded-md text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 capitalize">
              {cat.category} {cat.subCategories.length > 0 && <ChevronRight size={14} />}
            </Link>
            {cat.subCategories.length > 0 && (
              <div className="absolute top-0 -right-2 translate-x-full w-56 p-2 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 hidden group-hover/sub:block">
                {cat.subCategories.map((sub) => (
                  <Link key={sub} to={`/category/${encodeURIComponent(cat.category)}/${encodeURIComponent(sub)}`} className="block px-3 py-2 text-sm rounded-md text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 capitalize">{sub}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
);
  
const UserMenu = ({ displayName, logout }) => (
    <div className="relative group">
      <button className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
            {displayName.charAt(0).toUpperCase()}
        </div>
        <ChevronDown size={16} />
      </button>
      <div className="absolute right-0 mt-3 w-56 p-2 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 text-slate-800 dark:text-slate-200">
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 mb-2">
            <p className="text-sm font-semibold">Signed in as</p>
            <p className="text-sm truncate">{displayName}</p>
        </div>
        <DropdownLink to="/profile" icon={<User size={16}/>}>My Profile</DropdownLink>
        <DropdownLink to="/orders" icon={<Package size={16}/>}>My Orders</DropdownLink>
        <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
);

const DropdownLink = ({ to, icon, children }) => (
    <Link to={to} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">{icon} {children}</Link>
);
  
const IconButton = ({ as: Component = 'button', count, children, ...props }) => (
    <Component className="relative p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" {...props}>
      {children}
      {count > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-slate-900">{count}</span>}
    </Component>
);

const MobileCategoryItem = ({ category, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <div className="flex justify-between items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
          <Link to={`/category/${encodeURIComponent(category.category)}`} onClick={onNavigate} className="flex-grow capitalize font-medium">{category.category}</Link>
          {category.subCategories.length > 0 && <button onClick={() => setIsOpen(!isOpen)} className="p-1"><ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>}
        </div>
        {isOpen && category.subCategories.length > 0 && (
          <div className="pl-6 pt-1 pb-2 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 ml-3">
            {category.subCategories.map(sub => (
              <Link key={sub} to={`/category/${encodeURIComponent(category.category)}/${encodeURIComponent(sub)}`} onClick={onNavigate} className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 capitalize text-sm text-slate-600 dark:text-slate-400">{sub}</Link>
            ))}
          </div>
        )}
      </div>
    );
};
  
const MobileNavLink = ({ icon, onClick, children }) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-left">
        {icon}
        <span className="font-medium">{children}</span>
    </button>
);