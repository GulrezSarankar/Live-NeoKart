import React, { useEffect, useState } from "react";
import AdminApiAxiosInstance from "../../api/adminaxios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ShoppingCart, DollarSign, AlertCircle, Moon, Sun } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [weeklyIncome, setWeeklyIncome] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersStatus, setOrdersStatus] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🌙 Theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        totalRes,
        weeklyRes,
        monthlyRes,
        topRes,
        ordersRes,
        lowStockRes,
      ] = await Promise.all([
        AdminApiAxiosInstance.get("/admin/dashboard/total-products"),
        AdminApiAxiosInstance.get("/admin/dashboard/weekly-income"),
        AdminApiAxiosInstance.get("/admin/dashboard/monthly-income"),
        AdminApiAxiosInstance.get("/admin/dashboard/top-products"),
        AdminApiAxiosInstance.get("/admin/dashboard/orders-status"),
        AdminApiAxiosInstance.get("/admin/dashboard/low-stock"),
      ]);

      setTotalProducts(totalRes.data || 0);
      setWeeklyIncome(
        Array.isArray(weeklyRes.data)
          ? weeklyRes.data.map((item) => ({
              day: item.day || item.date || "N/A",
              income: Number(item.income || item.totalIncome || 0),
            }))
          : []
      );

      setMonthlyIncome(
        monthlyRes.data
          ? Object.entries(monthlyRes.data).map(([month, income]) => ({
              month,
              income: Number(income) || 0,
            }))
          : []
      );

      setTopProducts(topRes.data || []);
      setOrdersStatus(ordersRes.data || {});
      setLowStock(lowStockRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const orderStatusData = Object.entries(ordersStatus).map(([name, value]) => ({
    name,
    value: value || 0,
  }));

  const totalWeeklyIncome = weeklyIncome.reduce(
    (acc, item) => acc + (item.income || 0),
    0
  );
  const totalMonthlyIncome = monthlyIncome.reduce(
    (acc, item) => acc + (item.income || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
        <AdminSidebar />
        <main className="flex-1 ml-0 sm:ml-64 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 animate-pulse h-24 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <AdminSidebar />

      <main className="flex-1 ml-0 sm:ml-64 p-6 space-y-8 overflow-x-hidden text-gray-900 dark:text-gray-100">
        {/* 🌙 Theme Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-all"
          >
            {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>
        </div>

        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Total Products",
              value: totalProducts,
              icon: <ShoppingCart size={28} />,
              gradient: "from-blue-500 to-indigo-600",
            },
            {
              title: "Weekly Income",
              value: `₹${totalWeeklyIncome}`,
              icon: <DollarSign size={28} />,
              gradient: "from-green-500 to-emerald-600",
            },
            {
              title: "Monthly Income",
              value: `₹${totalMonthlyIncome}`,
              icon: <DollarSign size={28} />,
              gradient: "from-purple-500 to-pink-600",
            },
            {
              title: "Low Stock",
              value: lowStock.length,
              icon: <AlertCircle size={28} />,
              gradient: "from-red-500 to-rose-600",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              className={`bg-gradient-to-r ${card.gradient} text-white p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                {card.icon}
                <div className="text-right">
                  <p className="text-sm opacity-90">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 📈 Monthly Income & Orders Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow transition-colors duration-300">
            <h2 className="text-lg font-bold mb-4">📆 Monthly Income</h2>
            {monthlyIncome.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyIncome}>
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis />
                  <Tooltip formatter={(val) => `₹${val}`} />
                  <Bar dataKey="income" fill="#4ade80" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No monthly income data.</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow transition-colors duration-300">
            <h2 className="text-lg font-bold mb-4">📦 Orders Status</h2>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No order status data.</p>
            )}
          </div>
        </div>

        {/* 📊 Weekly Income Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow transition-colors duration-300">
          <h2 className="text-lg font-bold mb-4">📉 Weekly Income Trend</h2>
          {weeklyIncome.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyIncome}>
                <XAxis dataKey="day" stroke="#888" />
                <YAxis />
                <Tooltip formatter={(val) => `₹${val}`} />
                <Line type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No weekly income data.</p>
          )}
        </div>

        {/* 🏆 Top Selling Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow transition-colors duration-300">
          <h2 className="text-lg font-bold mb-4">🏆 Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <Swiper spaceBetween={20} slidesPerView={1} breakpoints={{ 768: { slidesPerView: 3 } }}>
              {topProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="flex flex-col items-center p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700 hover:shadow-lg transition transform hover:scale-105">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="font-semibold text-center text-lg">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sold: {product.quantitySold}</p>
                    <p className="text-sm font-medium mt-1">₹{product.price}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No top products available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
