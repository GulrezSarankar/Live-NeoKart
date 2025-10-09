import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { motion } from "framer-motion";
import { ImagePlus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AddProduct() {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    category: "",
    subCategory: "",
  });

  const [images, setImages] = useState([]); // multiple images
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Handle text field change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ Handle multiple image selection
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  // ✅ Remove individual image preview
  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ✅ Submit form
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!admin?.token) {
        setError("Unauthorized: Admin login required");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value.trim());
      });

      // ✅ Append all images to form data
      images.forEach((img) => fd.append("images", img));

      await axios.post("http://localhost:4000/api/products/add", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${admin.token}`,
        },
      });

      toast.success("✅ Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Add product failed:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized: Invalid or expired token");
      } else {
        setError(err.response?.data?.message || "Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Add New Product
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Product Name */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product Description"
              rows="4"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-6">
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                step="0.01"
                placeholder="Price"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                placeholder="Stock"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* SKU */}
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="SKU (Stock Keeping Unit)"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />

            {/* Category & Sub-Category */}
            <div className="grid grid-cols-2 gap-6">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category (e.g., Laptops)"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                placeholder="Sub-Category (e.g., Dell)"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Product Images
              </label>
              <div className="flex flex-wrap items-center gap-4">
                {/* Upload Box */}
                <label className="cursor-pointer flex items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <ImagePlus className="text-gray-400" size={32} />
                </label>

                {/* Image Previews */}
                {previews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      className="h-40 w-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Saving..." : "Add Product"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
