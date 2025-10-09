// src/pages/SearchProducts.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const SearchProducts = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axios
        .get(`http://localhost:4000/api/products/search?q=${query}`)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.error("Search error:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for: <span className="text-blue-600">{query}</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchProducts;
