import React, { useEffect, useState } from "react";
import AdminApiAxiosInstance from "../../api/adminaxios";

export default function AdminFlashSales() {
  const [flashSales, setFlashSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    startDatetime: "",
    endDatetime: "",
    status: true,
    products: [],
  });

  // Fetch flash sales and products on mount
  useEffect(() => {
    fetchFlashSales();
    fetchProducts();
  }, []);

  // Fetch all flash sales
  const fetchFlashSales = async () => {
    try {
      const res = await AdminApiAxiosInstance.get("/admin/flash-sales");
      const data = Array.isArray(res.data) ? res.data : res.data.flashSales || [];
      setFlashSales(data);
    } catch (err) {
      console.error("Error fetching flash sales:", err);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await AdminApiAxiosInstance.get("/products/all");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminApiAxiosInstance.post("/admin/flash-sales", form);
      setForm({ title: "", startDatetime: "", endDatetime: "", status: true, products: [] });
      fetchFlashSales();
    } catch (err) {
      console.error("Error adding flash sale:", err);
    }
  };

  // Handle delete flash sale
  const handleDelete = async (id) => {
    try {
      await AdminApiAxiosInstance.delete(`/admin/flash-sales/${id}`);
      fetchFlashSales();
    } catch (err) {
      console.error("Error deleting flash sale:", err);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Flash Sales Management</h1>

      {/* Add Flash Sale Form */}
      <form className="mb-6 space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="datetime-local"
          value={form.startDatetime}
          onChange={(e) => setForm({ ...form, startDatetime: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="datetime-local"
          value={form.endDatetime}
          onChange={(e) => setForm({ ...form, endDatetime: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <label className="block">
          Products:
          <select
            multiple
            value={form.products.map((p) => p.productId)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => ({
                productId: o.value,
                discountType: "percentage",
                discountValue: 0,
              }));
              setForm({ ...form, products: selected });
            }}
            className="border p-2 rounded w-full"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Flash Sale
        </button>
      </form>

      {/* Flash Sales Table */}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Products</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {flashSales.map((fs) => (
            <tr key={fs.id}>
              <td className="border p-2">{fs.title}</td>
              <td className="border p-2">{new Date(fs.startDatetime).toLocaleString()}</td>
              <td className="border p-2">{new Date(fs.endDatetime).toLocaleString()}</td>
              <td className="border p-2">{fs.products.map((p) => p.product.name).join(", ")}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(fs.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
