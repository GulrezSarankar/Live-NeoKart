import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import axiosInstance from "../../api/axiosInstance";
import {
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
  Star,
  Frown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Main Page Component ---
const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- State for Filters, Sorting, and Pagination ---
  const [filters, setFilters] = useState({
    price: 1000000,
    ratings: [],
  });
  const [sortOption, setSortOption] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  // --- Fetch Category Products ---
  useEffect(() => {
    if (!categoryName) return;
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/products/category/${encodeURIComponent(categoryName)}`
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  // --- Filtering & Sorting Logic ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Ratings filter
    if (filters.ratings.length > 0) {
      result = result.filter((p) =>
        filters.ratings.some((r) => Math.floor(p.averageRating || 0) >= r)
      );
    }

    // Price filter
    result = result.filter((p) => p.price <= filters.price);

    // Sorting
    switch (sortOption) {
      case "lowToHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "highToLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return result;
  }, [filters, sortOption, products]);

  // --- Pagination ---
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((page - 1) * perPage, page * perPage);
  }, [filteredProducts, page, perPage]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ price: 1000000, ratings: [] });
    setSortOption("relevance");
    setPage(1);
  };

  // --- Handlers for ProductCard actions ---
  const handleViewDetails = (product) => {
    window.location.href = `/product/${product.id}`;
  };

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
    // You can connect this to your CartContext if implemented
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Sidebar Filters (Desktop) --- */}
          <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              resultsCount={filteredProducts.length}
            />
          </aside>

          {/* --- Main Content: Products --- */}
          <main className="flex-1">
            <PageHeader categoryName={categoryName} />
            <ActionToolbar
              sortOption={sortOption}
              setSortOption={setSortOption}
              onFilterClick={() => setShowFilters(true)}
              resultsCount={filteredProducts.length}
            />

            {loading ? (
              <ProductGridSkeleton />
            ) : filteredProducts.length > 0 ? (
              <>
                <ProductGrid
                  products={paginatedProducts}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            ) : (
              <EmptyState onClearFilters={clearFilters} />
            )}
          </main>
        </div>
      </div>

      {/* --- Mobile Filter Drawer --- */}
      <MobileFilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={clearFilters}
          resultsCount={filteredProducts.length}
          isMobile={true}
          onClose={() => setShowFilters(false)}
        />
      </MobileFilterDrawer>
    </div>
  );
};

// --- UI Components ---
const PageHeader = ({ categoryName }) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
    <nav className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
      <Link to="/" className="hover:text-indigo-600">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
        {decodeURIComponent(categoryName)}
      </span>
    </nav>
    <h1 className="text-3xl lg:text-4xl font-extrabold capitalize text-slate-900 dark:text-slate-100 tracking-tight">
      {decodeURIComponent(categoryName)}
    </h1>
  </motion.div>
);

const ActionToolbar = ({ sortOption, setSortOption, onFilterClick, resultsCount }) => (
  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 my-6 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl">
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
      <span className="font-bold text-indigo-600 dark:text-indigo-400">{resultsCount}</span> Products Found
    </p>
    <div className="flex items-center gap-4">
      <button
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        onClick={onFilterClick}
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters
      </button>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border border-slate-300 dark:border-slate-600 rounded-lg pl-3 pr-8 py-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
        }}
      >
        <option value="relevance">Relevance</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  </div>
);

const FilterSidebar = ({ filters, onFilterChange, onClear, resultsCount, isMobile = false, onClose }) => (
  <div className="w-full bg-white dark:bg-slate-800/50 lg:bg-transparent lg:dark:bg-transparent rounded-xl lg:rounded-none p-4 lg:p-0">
    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Filters
      </h2>
      {isMobile && (
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    <div className="space-y-6">
      {/* Price Filter */}
      <CollapsibleSection title="Price Range">
        <input
          type="range"
          min="0"
          max="1000000"
          step="1000"
          value={filters.price}
          onChange={(e) => onFilterChange("price", parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          <span>₹0</span>
          <span>₹{filters.price.toLocaleString()}</span>
        </div>
      </CollapsibleSection>

      {/* Ratings Filter */}
      <CollapsibleSection title="Ratings">
        <div className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-3 text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => {
                  const newRatings = filters.ratings.includes(rating)
                    ? filters.ratings.filter((r) => r !== rating)
                    : [...filters.ratings, rating];
                  onFilterChange("ratings", newRatings);
                }}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-900"
              />
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < rating
                        ? "text-amber-400 fill-current"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                ))}
                <span className="font-medium ml-1">& above</span>
              </div>
            </label>
          ))}
        </div>
      </CollapsibleSection>
    </div>

    <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
      <button
        onClick={onClear}
        className="w-full text-center py-2.5 rounded-lg font-semibold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition"
      >
        Clear All Filters
      </button>
    </div>
  </div>
);

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-100 mb-3"
      >
        {title}
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? "" : "-rotate-90"}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductGrid = ({ products, onAddToCart, onViewDetails }) => (
  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <AnimatePresence>
      {products.map((product, i) => (
        <motion.div
          key={product.id || i}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <ProductCard
            product={product}
            rating={product.averageRating || "4.5"}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm animate-pulse"
      >
        <div className="w-full h-40 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ onClearFilters }) => (
  <div className="text-center py-20 px-6 bg-white dark:bg-slate-800/50 rounded-xl">
    <Frown className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
      No Products Found
    </h3>
    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">
      Try adjusting your filters or check back later.
    </p>
    <button
      onClick={onClearFilters}
      className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
    >
      Clear Filters
    </button>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center gap-2 sm:gap-4 mt-12 text-slate-800 dark:text-slate-100">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
    >
      Prev
    </button>
    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
    >
      Next
    </button>
  </div>
);

const MobileFilterDrawer = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 w-3/4 sm:w-2/3 bg-white dark:bg-slate-900 shadow-xl p-4 overflow-y-auto rounded-l-2xl"
        >
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default CategoryPage;
