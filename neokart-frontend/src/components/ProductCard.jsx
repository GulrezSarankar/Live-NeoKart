import React from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ product, rating, onViewDetails, onAddToCart }) => {
  const BASE_URL = process.env.REACT_APP_API_URL;

  const handleView = () => {
    if (typeof onViewDetails === "function") onViewDetails(product);
  };

  const handleAdd = () => {
    if (typeof onAddToCart === "function") onAddToCart(product);
  };

  const getPrimaryImage = () => {
    if (!product.images || product.images.length === 0) {
      return "/placeholder.png";
    }

    const primary = product.images.find((img) => img.primary);
    const imagePath = primary ? primary.imageUrl : product.images[0].imageUrl;
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
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer"
    >
      <div className="relative w-full h-56">
        <motion.img
          src={getPrimaryImage()}
          alt={product.name}
          className="w-full h-full object-contain p-4"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />

        <div className="absolute inset-0 flex justify-center items-center gap-3 opacity-0 hover:opacity-100">
          <button onClick={(e) => { e.stopPropagation(); handleAdd(); }}>
            <ShoppingCart />
          </button>

          <button onClick={(e) => { e.stopPropagation(); handleView(); }}>
            <Eye />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p>{formattedPrice}</p>

        <div className="flex items-center">
          <Star size={14} />
          <span>{rating || "4.5"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
