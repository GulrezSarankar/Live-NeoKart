// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
// import { useAdminAuth } from "../contexts/AdminAuthContext";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return <p>Loading...</p>;
  if (!admin) return <Navigate to="/admin/login" />;

  return children;
};

export default AdminRoute;
