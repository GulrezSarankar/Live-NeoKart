import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Upload, ArrowLeft, Save } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminUpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    category: "",
    subCategory: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        const data = res.data;
        setProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          sku: data.sku || "",
          category: data.category || "",
          subCategory: data.subCategory || "",
        });

        // Show existing images
        if (data.images && data.images.length > 0) {
          setPreviewImages(
            data.images.map((img) => `http://localhost:4000${img.imageUrl}`)
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  // ✅ Handle form input change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ✅ Submit updated product
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please login as admin first!");
      navigate("/admin/login");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) =>
        formData.append(key, value)
      );
      images.forEach((img) => formData.append("images", img));

      await axios.put(
        `http://localhost:4000/api/products/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/admin/login");
      } else {
        toast.error(err.response?.data?.error || "Update failed.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-72">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Update Product</h1>
        </div>

        <form
          onSubmit={handleUpdate}
          className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
        >
          {/* Product Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700">Name</label>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Category</label>
              <input
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Sub-Category
              </label>
              <input
                name="subCategory"
                value={product.subCategory}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">SKU</label>
              <input
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Price (₹)</label>
              <input
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Stock</label>
              <input
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              rows="4"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Product Images
            </label>
            <div className="flex flex-wrap gap-4 mb-4">
              {previewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover shadow"
                />
              ))}
            </div>

            <label className="flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-400 rounded-lg p-4 hover:bg-gray-50">
              <Upload size={20} className="text-gray-600 mr-2" />
              <span className="text-gray-600">
                Click to upload new images (optional)
              </span>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow"
            >
              <Save size={18} /> Save Changes
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
}
