import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/wishlist/me");
      setWishlist(res.data);
    } catch {
      setError("Failed to load wishlist.");
    }
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete("/api/wishlist/remove", { params: { productId } });
      fetchWishlist(); // refresh after removal
    } catch {
      alert("Failed to remove item.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!wishlist || !wishlist.products || wishlist.products.length === 0)
    return <p>Your wishlist is empty.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <img
              src={`http://localhost:4000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-48 object-contain mb-2"
            />
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold">${product.price.toFixed(2)}</p>
            <button
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              onClick={() => removeFromWishlist(product.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
