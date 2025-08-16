import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ onEditProfile }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success("Logged out successfully!");
  };

  // Total items in cart
  const totalItems = cart?.items?.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-blue-600">
                NeoKart
              </Link>
            </div>

            <div className="flex space-x-4 items-center">
              {!user && (
                <>
                  <Link
                    className="text-gray-700 hover:text-blue-600 transition"
                    to="/about"
                  >
                    About Us
                  </Link>
                  <Link
                    className="text-gray-700 hover:text-blue-600 transition"
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                  <Link
                    className="text-gray-700 hover:text-blue-600 transition"
                    to="/privacy"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    to="/login"
                  >
                    Login
                  </Link>
                </>
              )}

              {user && (
                <>
                  {/* Cart Icon */}
                  <Link
                    to="/cart"
                    className="relative text-gray-700 hover:text-blue-600 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h14l-1.35 6H6.65L5 13zm0 0L4 5h16"
                      />
                    </svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="font-medium text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      {user.name}
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50 animate-slide-down">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            if (onEditProfile) onEditProfile();
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
