// src/pages/CategoryProducts.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, Grid, List } from "lucide-react";

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filterSubCategory, setFilterSubCategory] = useState("All");
  const [sortOption, setSortOption] = useState("relevance");
  const [view, setView] = useState("grid");
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/products/category/${categoryName}`)
      .then((res) => {
        setProducts(res.data);
        const subs = Array.from(new Set(res.data.map((p) => p.subCategory).filter(Boolean)));
        setSubCategories(subs);
        setFilterSubCategory("All");
      })
      .catch((err) => console.error(err));
  }, [categoryName]);

  // Save wishlist in localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter & Sort
  let filteredProducts = products.filter(
    (p) => filterSubCategory === "All" || p.subCategory === filterSubCategory
  );

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...filteredProducts];
    if (option === "low-to-high") sorted.sort((a, b) => a.price - b.price);
    else if (option === "high-to-low") sorted.sort((a, b) => b.price - a.price);
    else if (option === "name-az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (option === "name-za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    filteredProducts = sorted;
  };

  const toggleWishlist = (id) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );

  const handleViewDetails = (id) => navigate(`/product/${id}`);
  const handleBuyNow = (id) => navigate(`/checkout/${id}`);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold capitalize text-gray-800">
          {categoryName} Collection
        </h2>

        <div className="flex items-center gap-3">
          {/* Subcategory Dropdown */}
          {subCategories.length > 0 && (
            <select
              value={filterSubCategory}
              onChange={(e) => setFilterSubCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 text-gray-700 shadow-sm text-sm sm:text-base"
            >
              <option value="All">All Subcategories</option>
              {subCategories.map((sub, idx) => (
                <option key={idx} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700 shadow-sm text-sm sm:text-base"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="name-az">Name: A → Z</option>
            <option value="name-za">Name: Z → A</option>
          </select>

          {/* View Toggle */}
          <button
            className={`p-2 rounded-lg ${view === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
            onClick={() => setView("grid")}
          >
            <Grid size={20} />
          </button>
          <button
            className={`p-2 rounded-lg ${view === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
            onClick={() => setView("list")}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <p className="text-lg">No products found.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" : "space-y-6"}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`border rounded-2xl p-4 shadow-sm hover:shadow-lg bg-white flex ${view === "list" ? "flex-row gap-6" : "flex-col"}`}
            >
              {/* Product Image */}
              <div className="relative w-full sm:w-40">
                <img
                  src={`http://localhost:4000${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:scale-110 transition"
                >
                  <Heart
                    size={20}
                    className={wishlist.includes(product.id) ? "text-red-500 fill-red-500" : "text-gray-500"}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex-1 mt-3 sm:mt-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{product.name}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{product.description}</p>
                <p className="text-lg sm:text-xl font-bold text-green-600 mt-2">₹{product.price}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleViewDetails(product.id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleBuyNow(product.id)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition text-sm sm:text-base"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
