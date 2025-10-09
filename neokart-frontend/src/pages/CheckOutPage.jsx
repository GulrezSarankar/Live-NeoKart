// src/pages/CheckOutPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, User, Phone, MapPin, Landmark, CreditCard, DollarSign, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = "http://localhost:4000";

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
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                index + 1 <= currentStep ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                            }`}
                        >
                            {index + 1}
                        </div>
                        <p className={`mt-2 text-sm font-semibold ${index + 1 <= currentStep ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                            {step}
                        </p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 ${index + 1 < currentStep ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    )}
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
        if (!cart) {
            fetchCart();
        }
    }, [cart, fetchCart]);
    
    // Pre-fill user data when available
    useEffect(() => {
        if (user) {
            setAddress(prev => ({ ...prev, fullName: user.name || '', phone: user.phone || '' }));
        }
    }, [user]);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    if (authLoading || cartLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        // This can be a modal or a dedicated page component
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center px-4 bg-slate-50 dark:bg-slate-900">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Please log in to proceed</h2>
                <button
                    onClick={() => navigate("/login", { state: { from: '/checkout' } })}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition transform hover:scale-105"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (!cart || !cart.items?.length) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center px-4 bg-slate-50 dark:bg-slate-900">
                <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Your cart is empty 🛒</h2>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition transform hover:scale-105"
                >
                    Shop Now
                </button>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        const requiredFields = ["fullName", "phone", "street", "city", "state", "zip"];
        if (requiredFields.some(field => !address[field])) {
            toast.error("Please fill all required address fields!");
            return;
        }

        setPlacingOrder(true);
        const orderPromise = new Promise(async (resolve, reject) => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    navigate("/login");
                    return reject("Please log in first.");
                }

                const orderItems = cart.items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                }));
                const orderData = { items: orderItems, shippingAddress: address, paymentMethod };

                if (paymentMethod === "cod") {
                    const res = await axios.post(`${BACKEND_URL}/api/orders/create`, orderData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    navigate("/order-success", { state: { orderId: res.data.id } });
                    resolve(res.data);
                } else if (paymentMethod === "paypal") {
                    const res = await axios.post(`${BACKEND_URL}/api/paypal/create?total=${cart.totalPrice}`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.data.status === "success") {
                        window.location.href = res.data.approval_url;
                        // Promise resolves implicitly by redirecting
                    } else {
                        reject(res.data.message || "Failed to start PayPal payment.");
                    }
                }
            } catch (err) {
                console.error("Order failed:", err);
                if (err.response?.status === 401) navigate("/login");
                reject(err.response?.data?.message || "Something went wrong.");
            }
        });

        toast.promise(orderPromise, {
            loading: 'Placing your order...',
            success: <b>Order placed successfully!</b>,
            error: (err) => <b>{typeof err === 'string' ? err : 'Order failed. Please try again.'}</b>,
        }).finally(() => setPlacingOrder(false));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Toaster position="bottom-center" />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <CheckoutStepper currentStep={1} />
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Shipping Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput icon={<User size={18} className="text-slate-400" />} type="text" placeholder="Full Name" name="fullName" value={address.fullName} onChange={handleAddressChange} />
                                <FormInput icon={<Phone size={18} className="text-slate-400" />} type="tel" placeholder="Phone Number" name="phone" value={address.phone} onChange={handleAddressChange} />
                                <div className="md:col-span-2">
                                    <FormInput icon={<MapPin size={18} className="text-slate-400" />} type="text" placeholder="Street Address" name="street" value={address.street} onChange={handleAddressChange} />
                                </div>
                                <FormInput icon={<Landmark size={18} className="text-slate-400" />} type="text" placeholder="City" name="city" value={address.city} onChange={handleAddressChange} />
                                <FormInput icon={<Landmark size={18} className="text-slate-400" />} type="text" placeholder="State" name="state" value={address.state} onChange={handleAddressChange} />
                                <FormInput icon={<MapPin size={18} className="text-slate-400" />} type="text" placeholder="ZIP / Postal Code" name="zip" value={address.zip} onChange={handleAddressChange} />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MapPin size={18} className="text-slate-400"/></div>
                                    <input type="text" value="India" readOnly className="w-full pl-10 py-2.5 bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-lg cursor-not-allowed"/>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Payment Method</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'cod', title: 'Cash on Delivery', icon: <Package size={20} /> },
                                    { id: 'paypal', title: 'PayPal', icon: <DollarSign size={20} /> },
                                    { id: 'card', title: 'Credit / Debit Card', icon: <CreditCard size={20} /> },
                                ].map(({ id, title, icon }) => (
                                    <label key={id} className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === id ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-700 shadow-md' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                        <input type="radio" value={id} checked={paymentMethod === id} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden"/>
                                        <div className="w-8 text-indigo-600 dark:text-indigo-400">{icon}</div>
                                        <span className="font-semibold">{title}</span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-1 lg:sticky top-8"
                    >
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Order Summary</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                <AnimatePresence>
                                    {cart.items.map((item) => (
                                        <motion.div layout key={item.product.id} exit={{ opacity: 0, height: 0 }} className="flex justify-between items-start gap-3">
                                            <img src={`${BACKEND_URL}${item.product.imageUrl}`} alt={item.product.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm leading-tight">{item.product.name}</p>
                                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-sm">₹{item.product.price * item.quantity}</p>
                                            <button onClick={() => removeItem(item.product.id)} className="text-slate-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="border-t dark:border-slate-700 my-4"></div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Subtotal</span><span>₹{cart.totalPrice}</span></div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Shipping</span><span>Free</span></div>
                            </div>
                            <div className="border-t dark:border-slate-700 my-4"></div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                                <span>Total</span><span>₹{cart.totalPrice}</span>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={placingOrder}
                                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {placingOrder ? "Processing..." : "Place Order"}
                            </button>
                        </div>
                    </motion.aside>
                </div>
            </main>
        </div>
    );
};

export default CheckOutPage;
