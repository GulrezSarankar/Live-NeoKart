import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* About Section */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4">NeoKart</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your one-stop e-commerce platform. Shop the latest products, enjoy
            fast delivery, and stay updated with our new collections.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-indigo-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-400 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-indigo-400 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-indigo-600 transition transform hover:scale-110"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-indigo-600 transition transform hover:scale-110"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-indigo-600 transition transform hover:scale-110"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} NeoKart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
