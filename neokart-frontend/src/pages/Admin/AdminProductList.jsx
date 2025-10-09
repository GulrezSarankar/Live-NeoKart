import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileDown,
  FileText,
  PackageSearch,
  AlertTriangle,
  LayoutGrid,
  List,
  Edit3,
  Trash2,
  Layers3,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:4000/api/products/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      setProducts(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please log in again.");
        navigate("/admin/login");
      } else {
        toast.error("Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please log in as admin first.");
      navigate("/admin/login");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/products/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Session expired! Please log in again.");
        navigate("/admin/login");
      } else {
        toast.error(err.response?.data?.error || "Failed to delete product");
      }
    }
  };

  // ✅ Edit product
  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  // ✅ Go to variants page
  // ✅ Corrected
const handleManageVariants = (id) => {
  navigate(`/admin/products/${id}/variants`);
};


  // ✅ Filter
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ CSV Download
  const downloadCSV = () => {
    if (!products.length) return toast.error("No products to export");

    const csvRows = [
      ["ID", "Name", "Category", "SubCategory", "Price", "Stock", "SKU"],
      ...products.map((p) => [
        p.id,
        p.name,
        p.category,
        p.subCategory,
        p.price,
        p.stock,
        p.sku,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "products.csv");
    toast.success("CSV file downloaded");
  };

  // ✅ PDF Download
  const downloadPDF = () => {
    if (!products.length) return toast.error("No products to export");

    const doc = new jsPDF();
    doc.text("NeoKart Product List", 14, 16);
    autoTable(doc, {
      head: [["ID", "Name", "Category", "Price", "Stock", "SKU"]],
      body: products.map((p) => [
        p.id,
        p.name,
        p.category,
        `₹${p.price?.toLocaleString() || 0}`,
        p.stock,
        p.sku,
      ]),
    });
    doc.save("products.pdf");
    toast.success("PDF file downloaded");
  };

  // ✅ Get product image
  const getMainImage = (product) => {
    if (!product.images || product.images.length === 0)
      return "/no-image.png";
    const mainImg =
      product.images.find((img) => img.primary) || product.images[0];
    return `http://localhost:4000${mainImg.imageUrl}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:ml-72">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PackageSearch size={24} />
            Product Management
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FileDown size={18} /> CSV
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FileText size={18} /> PDF
            </button>
            <button
              onClick={() =>
                setViewMode(viewMode === "grid" ? "list" : "grid")
              }
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            >
              {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertTriangle size={40} className="mb-2 text-yellow-500" />
            <p>No products found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white shadow-md rounded-xl p-4"
              >
                <img
                  src={getMainImage(product)}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-lg mb-3"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.category}</p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-indigo-600 font-bold text-lg">
                    ₹{product.price?.toLocaleString() || 0}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      product.stock > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleManageVariants(product.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                  >
                    <Layers3 size={16} /> Variants
                  </button>
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={getMainImage(product)}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold">{product.name}</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">
                      ₹{product.price?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleManageVariants(product.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >
                        <Layers3 size={16} /> Variants
                      </button>
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
