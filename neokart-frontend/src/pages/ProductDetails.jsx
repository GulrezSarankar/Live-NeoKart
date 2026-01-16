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

const BASE_URL = process.env.REACT_APP_API_URL;

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

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

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
          setRelated(relRes.data.filter((p) => p.id !== res.data.id).slice(0, 4));
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen animate-pulse">
        Loading product details...
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
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
      ? `${BASE_URL}${images[mainImageIndex].imageUrl}`
      : `${BASE_URL}${product.imageUrl}`;

  const DESCRIPTION_LIMIT = 250;
  const showFullDescription = product.description?.length > DESCRIPTION_LIMIT;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-center" />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="relative bg-white rounded-xl shadow overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                className={`w-full h-[480px] object-contain transition-transform ${
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setMainImageIndex((mainImageIndex + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 justify-center">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL}${img.imageUrl}`}
                    onClick={() => setMainImageIndex(i)}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                      i === mainImageIndex
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <span className="text-blue-600 font-semibold">{product.category}</span>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <StarRating rating={4.5} />

            <p className="text-3xl font-bold">₹{product.price.toLocaleString()}</p>

            <p className="text-gray-600">
              {showFullDescription && !expanded
                ? `${product.description.substring(0, DESCRIPTION_LIMIT)}...`
                : product.description}
              {showFullDescription && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-2 text-blue-600 font-semibold"
                >
                  {expanded ? "Show Less" : "Read More"}
                </button>
              )}
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Zap size={20} /> Buy Now
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <img
                    src={`${BASE_URL}${item.images?.[0]?.imageUrl || item.imageUrl}`}
                    className="h-40 w-full object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="font-bold text-blue-600">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
