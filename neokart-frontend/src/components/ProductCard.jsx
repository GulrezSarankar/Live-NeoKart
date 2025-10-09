import React from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ product, rating, onViewDetails, onAddToCart }) => {
  const BASE_URL = "http://localhost:4000";

  // ✅ Safely handle missing props
  const handleView = () => {
    if (typeof onViewDetails === "function") {
      onViewDetails(product);
    } else {
      console.warn("⚠️ onViewDetails not provided for product:", product.name);
    }
  };

  const handleAdd = () => {
    if (typeof onAddToCart === "function") {
      onAddToCart(product);
    } else {
      console.warn("⚠️ onAddToCart not provided for product:", product.name);
    }
  };

  const getPrimaryImage = () => {
    if (!product.images || product.images.length === 0) {
      return "/placeholder.png"; // Default placeholder image
    }

    const primary = product.images.find((img) => img.primary);
    const imagePath = primary ? primary.imageUrl : product.images[0].imageUrl;

    // Ensure path starts with a '/'
    const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BASE_URL}${normalizedPath}`;
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(product.price);

  return (
    <div
      onClick={handleView}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden group relative border border-transparent dark:hover:border-slate-700 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative w-full h-56 bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center overflow-hidden">
        <motion.img
          src={getPrimaryImage()}
          alt={product.name || "Product image"}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-in-out"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />

        {/* Hover Actions */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className="bg-white text-slate-800 rounded-full w-12 h-12 flex items-center justify-center transform hover:scale-110 hover:bg-green-400 hover:text-white transition-all duration-300 shadow-md"
            aria-label="Add to cart"
          >
            <ShoppingCart size={22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            className="bg-white text-slate-800 rounded-full w-12 h-12 flex items-center justify-center transform hover:scale-110 hover:bg-blue-400 hover:text-white transition-all duration-300 shadow-md"
            aria-label="View details"
          >
            <Eye size={22} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 text-left">
        <h3 className="text-md font-semibold mb-1 truncate text-slate-800 dark:text-slate-100">
          {product.name}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-slate-900 dark:text-white font-bold text-lg">
            {formattedPrice}
          </span>
          <div className="flex items-center bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
            <Star className="fill-current" size={14} />
            <span className="ml-1 font-medium text-sm">
              {rating ? parseFloat(rating).toFixed(1) : "4.5"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
