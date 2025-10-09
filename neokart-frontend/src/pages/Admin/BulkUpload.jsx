import React, { useState } from "react";
import axios from "axios";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse("");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4000/api/products/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setResponse(res.data.message || "✅ Upload successful!");
      toast.success(res.data.message || "Upload successful!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setResponse(err.response?.data?.error || "❌ Upload failed!");
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:block w-64">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10">
        <motion.div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
            📦 Bulk Product Upload
          </h1>
          <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">
            Upload a CSV file to add multiple products at once.
          </p>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-10 mb-6 text-center">
            <Upload className="text-gray-400 mb-4" size={50} />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-sm w-full text-center cursor-pointer"
            />
            {file && <p className="mt-3 text-gray-600 text-sm">{file.name}</p>}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-2 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload CSV"}
            </button>

            <a
              href="/neokart_bulk_products.csv"
              download
              className="w-full sm:w-auto px-6 py-2 rounded-lg text-indigo-600 font-semibold border border-indigo-600 hover:bg-indigo-50 transition"
            >
              Download Sample CSV
            </a>
          </div>

          {response && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm sm:text-base">
              {response.startsWith("✅") ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              <p className="text-gray-700">{response}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BulkUpload;
