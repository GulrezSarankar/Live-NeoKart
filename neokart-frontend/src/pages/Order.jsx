import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Package, ShoppingCart, Truck, AlertCircle, RefreshCw, X } from 'lucide-react';

// --- Mocked API and Data to make the component runnable ---

const mockOrdersData = [
  {
    id: "NEO-84B92-24",
    status: "SHIPPED",
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 1398.00,
    items: [
      { id: 1, quantity: 1, price: 999.00, product: { name: "Wireless Noise-Cancelling Headphones", imageUrl: "https://placehold.co/100x100/ec4899/white?text=Audio" } },
      { id: 2, quantity: 2, price: 199.50, product: { name: "Smart LED Light Bulb", imageUrl: "https://placehold.co/100x100/8b5cf6/white?text=SmartHome" } },
    ]
  },
  {
    id: "NEO-55A17-24",
    status: "PROCESSING",
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 849.00,
    items: [
      { id: 3, quantity: 1, price: 849.00, product: { name: "Mechanical Gaming Keyboard", imageUrl: "https://placehold.co/100x100/f59e0b/white?text=Gaming" } },
    ]
  },
    {
    id: "NEO-C3D81-23",
    status: "DELIVERED",
    orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 249.00,
    items: [
      { id: 4, quantity: 1, price: 249.00, product: { name: "Portable Power Bank 20000mAh", imageUrl: "https://placehold.co/100x100/10b981/white?text=Mobile" } },
    ]
  },
  {
    id: "NEO-F9E4A-23",
    status: "CANCELLED",
    orderDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 499.00,
    items: [
      { id: 5, quantity: 1, price: 499.00, product: { name: "Ergonomic Mouse", imageUrl: "https://placehold.co/100x100/f43f5e/white?text=Cancelled" } },
    ]
  },
];


const mockAxiosInstance = {
    get: (url) => {
        console.log(`Mock GET request to: ${url}`);
        return new Promise(resolve => {
            setTimeout(() => {
                // To simulate different states, uncomment one of the following lines:
                resolve({ data: mockOrdersData }); // Success
                // resolve({ data: [] }); // Empty state
                // reject(new Error("Failed to fetch")); // Error state
            }, 1200);
        });
    }
};


// --- Main Orders Page Component ---

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, this would be: `axiosInstance.get("/api/orders/my")`
        const res = await mockAxiosInstance.get("/api/orders/my");
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
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            }}
            initial="hidden"
            animate="show"
        >
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
             <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-slate-900 dark:text-slate-50 tracking-tight">My Orders</h1>
             <p className="text-slate-500 dark:text-slate-400 mb-8">View your order history and check the status of your recent purchases.</p>
        </motion.div>
        {renderContent()}
      </div>
    </div>
  );
}


// --- Sub-components for a Clean and Organized Structure ---

const OrderCard = ({ order }) => {
    const statusInfo = {
        SHIPPED: { text: "Shipped", icon: Truck, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/50" },
        PROCESSING: { text: "Processing", icon: RefreshCw, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/50" },
        DELIVERED: { text: "Delivered", icon: Package, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/50" },
        CANCELLED: { text: "Cancelled", icon: X, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/50" },
    };

    const currentStatus = statusInfo[order.status] || statusInfo.PROCESSING;
    const StatusIcon = currentStatus.icon;

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
            {/* Card Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-5 border-b border-slate-200 dark:border-slate-700">
                <div>
                    <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Order ID: {order.id}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                 <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${currentStatus.bg} ${currentStatus.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span>{currentStatus.text}</span>
                </div>
            </header>
            
            {/* Card Body - Items */}
            <div className="p-4 md:p-5">
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item.id} className="flex items-start gap-4">
                             <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{item.product.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                ₹{item.price.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card Footer */}
            <footer className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 md:p-5 bg-slate-50 dark:bg-slate-800 rounded-b-xl">
                 <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Order Total: <span className="text-xl font-bold">₹{order.totalPrice.toFixed(2)}</span>
                </p>
                <div className="flex items-center gap-3">
                    <Link to={`/orders/${order.id}`} className="px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                        View Details
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition">
                       <FileText className="w-4 h-4"/> Invoice
                    </button>
                </div>
            </footer>
        </motion.div>
    );
};


const OrdersSkeleton = () => (
    <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                    </div>
                    <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-full shimmer"></div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 shimmer flex-shrink-0"></div>
                        <div className="flex-grow space-y-2">
                           <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 shimmer"></div>
                           <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 shimmer"></div>
                        </div>
                         <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 shimmer flex-shrink-0"></div>
                        <div className="flex-grow space-y-2">
                           <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5 shimmer"></div>
                           <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 shimmer"></div>
                        </div>
                         <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                    </div>
                </div>
                 <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-b-xl flex justify-between items-center">
                      <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                      <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
                 </div>
             </div>
        ))}
    </div>
);


const EmptyState = () => (
    <div className="text-center py-20 px-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <ShoppingCart className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">No Orders Yet</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-sm mx-auto">
           It looks like you haven't placed any orders. All your future purchases will appear here.
        </p>
        <Link to="/" className="inline-block px-6 py-3 rounded-lg font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
            Continue Shopping
        </Link>
    </div>
);

const ErrorState = ({ message, onRetry }) => (
    <div className="text-center py-20 px-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Something Went Wrong</h3>
        <p className="text-red-600 dark:text-red-300 mt-2 mb-6 max-w-sm mx-auto">
           {message}
        </p>
        <button onClick={onRetry} className="inline-block px-6 py-3 rounded-lg font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm">
            Try Again
        </button>
    </div>
);

