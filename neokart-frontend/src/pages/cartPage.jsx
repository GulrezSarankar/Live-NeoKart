import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = "http://localhost:4000";

// Helper to get the correct image URL
const getProductImage = (product) => {
  if (!product || !product.images || product.images.length === 0) {
    return "/placeholder.png";
  }
  const primaryImage = product.images.find((img) => img.primary) || product.images[0];
  const path = primaryImage.imageUrl.startsWith("/")
    ? primaryImage.imageUrl
    : `/${primaryImage.imageUrl}`;
  return `${BASE_URL}${path}`;
};

// Empty cart state
const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <svg
          className="w-48 h-48 mx-auto text-gray-300 dark:text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 16H15.5C16.8807 16 18 14.8807 18 13.5C18 12.1193 16.8807 11 15.5 11H11.5C10.1193 11 9 9.88071 9 8.5C9 7.11929 10.1193 6 11.5 6H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 6H20L18.2941 16.2353C18.1228 17.2283 17.2581 18 16.25 18H8.75C7.74188 18 6.87723 17.2283 6.70588 16.2353L5 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-white">
          Your cart is empty!
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <ArrowLeft size={18} />
          Start Shopping
        </button>
      </motion.div>
    </div>
  );
};

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleWishlistClick = (itemName) => {
    toast.success(`"${itemName}" added to wishlist!`, { icon: "❤️" });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "SAVE10") {
      const newDiscount = cart.totalPrice * 0.1;
      setDiscount(newDiscount);
      toast.success("Promo code applied successfully!");
    } else {
      setDiscount(0);
      toast.error("Invalid promo code.");
    }
  };

  const subtotal = cart?.totalPrice || 0;
  const total = subtotal - discount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="bottom-center" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Your Shopping Cart
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            You have {cart.items.length} item(s) in your cart.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.items.map((item) => {
                const imageSrc = getProductImage(item.product);
                return (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={imageSrc}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer flex-shrink-0"
                      onClick={() => navigate(`/product/${item.product.id}`)}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                    <div className="flex-1 flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h3
                          className="text-lg font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-indigo-600"
                          onClick={() =>
                            navigate(`/product/${item.product.id}`)
                          }
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                          ₹{item.product.price.toLocaleString()}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            className="w-8 h-8 rounded-full border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            onClick={() =>
                              updateItem(
                                item.product.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            −
                          </button>
                          <span className="font-medium text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 rounded-full border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            onClick={() =>
                              updateItem(item.product.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleWishlistClick(item.product.name)
                            }
                            className="p-2 text-gray-500 hover:text-pink-500 transition"
                          >
                            <Heart size={20} />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 text-gray-500 hover:text-red-500 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                <ArrowLeft size={18} /> Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:underline font-semibold"
              >
                Clear Cart
              </button>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="lg:col-span-1 lg:sticky top-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t dark:border-gray-700 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <form className="space-y-2 pt-2" onSubmit={handleApplyPromo}>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  >
                    Apply
                  </button>
                </div>
              </form>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
