import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, rating }) => {
  const navigate = useNavigate();

  const getImageUrl = (filename) => {
    if (!filename) return "/placeholder.png";
    if (filename.startsWith("http")) return filename;
    return `http://localhost:4000${filename}`;
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all relative">
      <img
        src={getImageUrl(product.imageUrl)}
        alt={product.name}
        className="w-full h-48 object-contain p-4"
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-blue-600 font-bold">₹{product.price}</p>
        <p className="text-sm text-yellow-500">Rating: {rating?.toFixed(1) || 0}★</p>

        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
  