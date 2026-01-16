// src/pages/CheckOutPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, User, Phone, MapPin, Landmark, CreditCard, DollarSign, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = process.env.REACT_APP_API_URL;

// --- Reusable Components ---
const FormInput = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const CheckoutStepper = ({ currentStep }) => {
  const steps = ["Shipping", "Payment", "Review"];
  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index + 1 <= currentStep ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
              {index + 1}
            </div>
            <p className="mt-2 text-sm font-semibold">{step}</p>
          </div>
          {index < steps.length - 1 && <div className="flex-1 h-1 mx-4 bg-slate-200 dark:bg-slate-700"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- Main Checkout Page Component ---
const CheckOutPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, removeItem, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!cart) fetchCart();
  }, [cart, fetchCart]);

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({ ...prev, fullName: user.name || "", phone: user.phone || "" }));
    }
  }, [user]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return navigate("/login");

      const orderItems = cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const orderData = { items: orderItems, shippingAddress: address, paymentMethod };

      const res = await axios.post(`${BACKEND_URL}/api/orders/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/order-success", { state: { orderId: res.data.id } });
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("Order failed. Try again.");
    }
  };

  if (authLoading || cartLoading) return <div className="text-center p-20">Loading...</div>;
  if (!user) return <div className="text-center p-20">Please login</div>;
  if (!cart?.items?.length) return <div className="text-center p-20">Cart is empty</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Toaster position="bottom-center" />
      <main className="container mx-auto px-4 py-12">
        <CheckoutStepper currentStep={1} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput icon={<User size={18} />} name="fullName" value={address.fullName} onChange={handleAddressChange} placeholder="Full Name" />
                <FormInput icon={<Phone size={18} />} name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone" />
                <FormInput icon={<MapPin size={18} />} name="street" value={address.street} onChange={handleAddressChange} placeholder="Street" />
                <FormInput icon={<Landmark size={18} />} name="city" value={address.city} onChange={handleAddressChange} placeholder="City" />
                <FormInput icon={<Landmark size={18} />} name="state" value={address.state} onChange={handleAddressChange} placeholder="State" />
                <FormInput icon={<MapPin size={18} />} name="zip" value={address.zip} onChange={handleAddressChange} placeholder="ZIP" />
              </div>
            </motion.div>
          </div>

          <motion.aside className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex justify-between mb-2">
                <img src={`${BACKEND_URL}${item.product.imageUrl}`} alt="" className="w-12 h-12 object-cover" />
                <span>{item.product.name}</span>
                <span>₹{item.product.price * item.quantity}</span>
                <button onClick={() => removeItem(item.product.id)}><Trash2 size={16} /></button>
              </div>
            ))}

            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg"
            >
              Place Order
            </button>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default CheckOutPage;
