import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_API_URL;

// Helper to get correct image
const getProductImage = (product) => {
  if (!product || !product.images || product.images.length === 0) {
    return "/placeholder.png";
  }
  const primary = product.images.find((img) => img.primary) || product.images[0];
  const path = primary.imageUrl.startsWith("/") ? primary.imageUrl : `/${primary.imageUrl}`;
  return `${BASE_URL}${path}`;
};

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold">Your cart is empty</h2>
      <button onClick={() => navigate("/")} className="mt-4 flex items-center gap-2 text-indigo-600">
        <ArrowLeft size={18} /> Start Shopping
      </button>
    </div>
  );
};

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cart?.totalPrice || 0;
  const total = subtotal - discount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo applied!");
    } else {
      toast.error("Invalid promo code");
      setDiscount(0);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-center" />
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.product.id}
                className="flex gap-4 bg-white p-4 rounded shadow"
              >
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-blue-600">₹{item.product.price}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => updateItem(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateItem(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-bold">₹{item.product.price * item.quantity}</p>
                  <div className="flex gap-2 mt-2">
                    <Heart onClick={() => toast.success("Added to wishlist")} />
                    <Trash2 onClick={() => removeItem(item.product.id)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between">
            <button onClick={() => navigate("/")}>
              <ArrowLeft size={18} /> Continue Shopping
            </button>
            <button onClick={clearCart} className="text-red-500">Clear Cart</button>
          </div>
        </section>

        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="flex justify-between mt-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <form onSubmit={handleApplyPromo} className="mt-3 flex gap-2">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo code"
              className="border p-2 flex-1"
            />
            <button type="submit" className="bg-gray-200 px-3">Apply</button>
          </form>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </aside>
      </main>
    </div>
  );
}
