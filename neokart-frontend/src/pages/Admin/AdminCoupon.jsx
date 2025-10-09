import React, { useEffect, useState } from "react";
import AdminApiAxiosInstance from "../../api/adminaxios"; // keep this

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchaseAmount: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
    status: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await AdminApiAxiosInstance.get("/admin/coupons");
    setCoupons(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AdminApiAxiosInstance.post("/admin/coupons", form);
    fetchCoupons();
  };

  const handleDelete = async (id) => {
    await AdminApiAxiosInstance.delete(`/admin/coupons/${id}`);
    fetchCoupons();
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Coupons Management</h1>

      <form className="mb-6 space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input
          type="number"
          placeholder="Discount Value"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Minimum Purchase"
          value={form.minPurchaseAmount}
          onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Usage Limit"
          value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Coupon
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Min Purchase</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.discountType}</td>
              <td className="border p-2">{c.discountValue}</td>
              <td className="border p-2">{c.minPurchaseAmount}</td>
              <td className="border p-2">{new Date(c.startDate).toLocaleString()}</td>
              <td className="border p-2">{new Date(c.endDate).toLocaleString()}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(c.id)}
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
