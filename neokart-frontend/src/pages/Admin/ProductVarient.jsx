import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Plus, ArrowLeft } from "lucide-react";

const ProductVariants = () => {
  const { productId } = useParams();
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({
    color: "",
    size: "",
    price: "",
    stock: "",
  });

  const navigate = useNavigate();

  // ✅ Wrap in useCallback to prevent ESLint warning
  const fetchVariants = useCallback(async () => {
    if (!productId) {
      console.error("❌ No productId found in URL");
      toast.error("Product ID not found");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `http://localhost:4000/api/admin/variants/${productId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setVariants(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching variants:", err);
      toast.error("Failed to fetch variants");
    }
  }, [productId]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  // ✅ Add new variant
  const handleAddVariant = async (e) => {
    e.preventDefault();
    if (!newVariant.color || !newVariant.size || !newVariant.price) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `http://localhost:4000/api/admin/variants/${productId}`,
        newVariant,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      toast.success("✅ Variant added successfully");
      setNewVariant({ color: "", size: "", price: "", stock: "" });
      fetchVariants();
    } catch (err) {
      console.error("❌ Error adding variant:", err);
      toast.error("Failed to add variant");
    }
  };

  // ✅ Delete variant
  const handleDelete = async (variantId) => {
    const confirmDelete = window.confirm("Are you sure to delete this variant?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `http://localhost:4000/api/admin/variants/${variantId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      toast.success("🗑️ Variant deleted");
      fetchVariants();
    } catch (err) {
      console.error("❌ Error deleting variant:", err);
      toast.error("Failed to delete variant");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Product Variants
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <p className="text-gray-500 mb-4">🆔 Product ID: {productId}</p>

      {/* Add Variant Form */}
      <form
        onSubmit={handleAddVariant}
        className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap gap-4"
      >
        <input
          type="text"
          placeholder="Color"
          value={newVariant.color}
          onChange={(e) =>
            setNewVariant({ ...newVariant, color: e.target.value })
          }
          className="border p-2 rounded-md flex-1 min-w-[150px]"
        />
        <input
          type="text"
          placeholder="Size / Storage"
          value={newVariant.size}
          onChange={(e) =>
            setNewVariant({ ...newVariant, size: e.target.value })
          }
          className="border p-2 rounded-md flex-1 min-w-[150px]"
        />
        <input
          type="number"
          placeholder="Price"
          value={newVariant.price}
          onChange={(e) =>
            setNewVariant({ ...newVariant, price: e.target.value })
          }
          className="border p-2 rounded-md flex-1 min-w-[150px]"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newVariant.stock}
          onChange={(e) =>
            setNewVariant({ ...newVariant, stock: e.target.value })
          }
          className="border p-2 rounded-md flex-1 min-w-[150px]"
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Variant
        </button>
      </form>

      {/* Variants Table */}
      {variants.length === 0 ? (
        <p className="text-gray-500">No variants found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Color</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Price (₹)</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-gray-50">
                <td className="border p-2">{variant.color}</td>
                <td className="border p-2">{variant.size}</td>
                <td className="border p-2">₹{variant.price}</td>
                <td className="border p-2">{variant.stock}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(variant.id)}
                    className="text-red-600 hover:text-red-800 flex items-center justify-center mx-auto"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductVariants;
