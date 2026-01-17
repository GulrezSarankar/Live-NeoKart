// src/pages/SearchProducts.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";

const SearchProducts = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      setError("");

      try {
        const res = await axiosInstance.get(`/products/search?q=${encodeURIComponent(query)}`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for: <span className="text-blue-600">{query}</span>
      </h2>

      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">No products found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchProducts;
