import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FileText, Package, ShoppingCart, Truck, AlertCircle, RefreshCw, X } from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(`${BASE_URL}/api/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (e) {
      setError("Failed to fetch your orders. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderContent = () => {
    if (loading) return <OrdersSkeleton />;
    if (error) return <ErrorState message={error} onRetry={fetchOrders} />;
    if (orders.length === 0) return <EmptyState />;

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        {renderContent()}
      </div>
    </div>
  );
}

const OrderCard = ({ order }) => {
  const statusMap = {
    SHIPPED: { text: "Shipped", icon: Truck, color: "text-blue-600" },
    PROCESSING: { text: "Processing", icon: RefreshCw, color: "text-yellow-600" },
    DELIVERED: { text: "Delivered", icon: Package, color: "text-green-600" },
    CANCELLED: { text: "Cancelled", icon: X, color: "text-red-600" },
  };

  const current = statusMap[order.status] || statusMap.PROCESSING;
  const Icon = current.icon;

  return (
    <div className="bg-white border rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="font-bold">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toDateString()}
          </p>
        </div>
        <div className={`flex items-center gap-2 ${current.color}`}>
          <Icon size={16} />
          <span>{current.text}</span>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <img
              src={`${BASE_URL}${item.product.imageUrl}`}
              alt={item.product.name}
              className="w-14 h-14 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">₹{item.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 border-t pt-3">
        <p className="font-bold">Total: ₹{order.totalPrice}</p>
        <Link
          to={`/orders/${order.id}`}
          className="text-indigo-600 font-semibold text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const OrdersSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <ShoppingCart className="mx-auto mb-4" size={48} />
    <p className="text-lg font-semibold">No orders yet</p>
    <Link to="/" className="text-indigo-600 mt-2 inline-block">
      Start Shopping
    </Link>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="text-center py-20">
    <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
    <p className="text-red-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Retry
    </button>
  </div>
);
