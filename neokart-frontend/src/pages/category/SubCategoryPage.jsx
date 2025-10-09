// src/pages/category/SubCategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Filter, X, Search } from "lucide-react";

// --- Custom Hook: Debounce Input Changes ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Product Card Component ---
const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:4000";

  // Handle multiple images from backend (first + hover)
  const images = product.images || [];
  const mainImage = images[0]?.imageUrl
    ? `${BASE_URL}/${images[0].imageUrl.replace(/^\/+/, "")}`
    : "/placeholder.png";
  const hoverImage = images[1]?.imageUrl
    ? `${BASE_URL}/${images[1].imageUrl.replace(/^\/+/, "")}`
    : mainImage;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log("🛒 Added to cart:", product);
    // TODO: connect to CartContext
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => navigate(`/product/${product.id || product._id}`)}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transform hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={mainImage}
          alt={product.name || "Product"}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          loading="lazy"
        />
        <img
          src={hoverImage}
          alt="Hover Preview"
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          <span>{product.rating?.toFixed(1) || "N/A"}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-semibold text-lg truncate text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 capitalize">
            {product.category || "Category"}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">
            ₹{product.price?.toLocaleString("en-IN") || 0}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 p-2.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition transform opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Skeleton Loader ---
const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 animate-pulse"
      >
        <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-lg"></div>
        <div className="mt-4 space-y-3">
          <div className="bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded"></div>
          <div className="bg-slate-200 dark:bg-slate-700 h-4 w-1/2 rounded"></div>
          <div className="bg-slate-200 dark:bg-slate-700 h-6 w-1/4 rounded mt-4"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function SubCategoryPage() {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState("rating_desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (debouncedMinPrice) params.append("minPrice", debouncedMinPrice);
        if (debouncedMaxPrice) params.append("maxPrice", debouncedMaxPrice);
        if (sortBy) params.append("sortBy", sortBy);

        let url = `/products/category/${encodeURIComponent(category)}`;
        if (subcategory) url += `/${encodeURIComponent(subcategory)}`;

        const res = await axiosInstance.get(`${url}?${params.toString()}`);
        setProducts(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchProducts();
  }, [category, subcategory, sortBy, debouncedMinPrice, debouncedMaxPrice]);

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSortBy("rating_desc");
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
          Filters
        </h3>
        <button
          onClick={resetFilters}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
        >
          Reset All
        </button>
      </div>
      <hr className="border-slate-200 dark:border-slate-700" />

      <div>
        <label
          htmlFor="sort-by"
          className="font-semibold mb-2 block text-slate-800 dark:text-slate-200"
        >
          Sort By
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="rating_desc">⭐ Popularity</option>
          <option value="price_asc">💰 Price: Low to High</option>
          <option value="price_desc">💰 Price: High to Low</option>
          <option value="newest">🆕 Newest Arrivals</option>
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">
          Price Range (₹)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-slate-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
            <Link to="/" className="hover:text-indigo-500">
              Home
            </Link>{" "}
            /{" "}
            <Link
              to={`/category/${category}`}
              className="hover:text-indigo-500"
            >
              {category}
            </Link>{" "}
            {subcategory && `/ ${subcategory}`}
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mt-2">
            <h1 className="text-3xl sm:text-4xl font-bold capitalize text-slate-900 dark:text-slate-50">
              {subcategory || category}
              {!loading && (
                <span className="text-lg font-medium text-slate-500 ml-3">
                  ({products.length} items)
                </span>
              )}
            </h1>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-sm"
            >
              <Filter size={16} /> Show Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <FilterPanel />
            </div>
          </aside>

          {/* Products */}
          <main className="lg:col-span-3">
            {loading ? (
              <ProductGridSkeleton />
            ) : error ? (
              <p className="text-red-500 text-center py-10">{error}</p>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl">
                <Search size={48} className="mx-auto text-slate-400" />
                <p className="mt-4 text-xl font-semibold text-slate-600 dark:text-slate-300">
                  No products found
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p, index) => (
                  <ProductCard key={p.id || p._id} product={p} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- Mobile Filter Drawer --- */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-slate-50 dark:bg-slate-900 shadow-xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 relative">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold">Filters</h2>
              </div>
              <div className="p-6 flex-grow overflow-y-auto">
                <FilterPanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
