import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const StarRating = ({ rating = 0 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          rating > i ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
        }`}
        fill="currentColor"
      />
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  // ✅ All hooks declared at top
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false); // ✅ moved up here

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
        if (res.data.category) {
          const relRes = await axiosInstance.get(
            `/products/category/${encodeURIComponent(res.data.category)}`
          );
          setRelated(
            relRes.data.filter((p) => p.id !== res.data.id).slice(0, 4)
          );
        }
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }
    toast.promise(addItem(product.id, 1), {
      loading: "Adding to cart...",
      success: "Item added successfully!",
      error: "Could not add item.",
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    navigate("/checkout", { state: { items: [{ ...product, quantity: 1 }] } });
  };

  // 🌀 Loading State
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300 animate-pulse">
        Loading product details...
      </div>
    );

  // 🚫 Not Found
  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-3xl font-bold text-red-500">Product Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Return to Home
        </button>
      </div>
    );

  const images = product.images || [];
  const mainImage =
    images.length > 0
      ? `http://localhost:4000${images[mainImageIndex].imageUrl}`
      : `http://localhost:4000${product.imageUrl}`;

  const DESCRIPTION_LIMIT = 250;
  const showFullDescription = product.description?.length > DESCRIPTION_LIMIT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <Toaster position="bottom-center" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 🔙 Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* 🖼️ Product Gallery */}
          <div className="space-y-6">
            <motion.div
              className="relative rounded-3xl bg-white dark:bg-gray-800 overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={mainImage}
                alt={product.name}
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                className={`w-full h-[480px] object-contain transition-all duration-500 ${
                  zoom ? "scale-110" : "scale-100"
                }`}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setMainImageIndex(
                        (mainImageIndex - 1 + images.length) % images.length
                      )
                    }
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-900/70 text-white rounded-full p-2 hover:bg-gray-800"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setMainImageIndex((mainImageIndex + 1) % images.length)
                    }
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-900/70 text-white rounded-full p-2 hover:bg-gray-800"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 justify-center">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:4000${img.imageUrl}`}
                    alt=""
                    onClick={() => setMainImageIndex(i)}
                    className={`w-20 h-20 rounded-xl border-2 object-cover cursor-pointer transition-all ${
                      i === mainImageIndex
                        ? "border-blue-600 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 🧾 Product Info */}
          <div className="flex flex-col gap-6">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-1 text-sm font-semibold rounded-full uppercase tracking-wide w-fit">
              {product.category}
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <StarRating rating={4.5} />

            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </p>
              <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck size={18} /> In Stock
              </span>
            </div>

            <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
              {showFullDescription && !expanded
                ? `${product.description.substring(0, DESCRIPTION_LIMIT)}...`
                : product.description}
              {showFullDescription && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {expanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y dark:border-gray-700">
              <div className="flex flex-col items-center">
                <Truck className="text-blue-500 mb-2" />
                <span className="font-medium text-sm">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <Package className="text-blue-500 mb-2" />
                <span className="font-medium text-sm">Secure Packaging</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="text-blue-500 mb-2" />
                <span className="font-medium text-sm">1-Year Warranty</span>
              </div>
            </div>

            {/* 🛒 Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-gray-700 dark:border-gray-300 text-gray-900 dark:text-white font-bold hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 shadow-lg transition-all duration-200"
              >
                <ShoppingCart size={22} /> Add to Cart
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <Zap size={22} /> Buy Now
              </motion.button>
            </div>
          </div>
        </div>

        {/* 🔗 Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/product/${item.id}`}
                    className="group block bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    <img
                      src={`http://localhost:4000${
                        item.images?.[0]?.imageUrl || item.imageUrl
                      }`}
                      alt={item.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-600">
                        {item.name}
                      </h3>
                      <p className="font-bold text-gray-900 dark:text-white mt-1">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
