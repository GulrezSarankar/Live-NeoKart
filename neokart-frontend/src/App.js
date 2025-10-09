// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";
import { CartProvider } from "./contexts/CartContext";

import AppNavbar from "./components/AppNavbar";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/wishlist";
import Orders from "./pages/Order";
import ProductList from "./pages/ProductList";
import CategoryPage from "./pages/category/categorypage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/cartPage";
// import ForgotPassword from "./pages/Forgot";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CheckoutPage from "./pages/CheckOutPage";
import CategoryProducts from "./pages/CategoryProducts";
import Profile from "./pages/Profile";
import OrderSuccessPage from "./pages/OrderSuccessPage";

// Admin Pages

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductList from "./pages/Admin/AdminProductList";
import AddProduct from "./pages/Admin/AddProduct";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import AdminProfile from "./pages/Admin/AdminProfile";
import ViewOrders from "./pages/viewOrders";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import ForgotPassword from "./pages/Admin/AdminForgotPassword";
import AdminRegister from "./pages/Admin/AdminRegister";
import AdminCoupons from "./pages/Admin/AdminCoupon";
import AdminFlashSales from "./pages/Admin/AdminFlashSale";
import SubCategoryPage from "./pages/category/SubCategoryPage";
import SearchProducts from "./pages/SearchProducts";
import VerifyOtp from "./pages/verifyOtp";
import BulkUpload from "./pages/Admin/BulkUpload";
import AdminAuditLogs from "./pages/Admin/AuditLog";
import AdminSettings from "./pages/Admin/AdminSettings";
import ProductVariants from "./pages/Admin/ProductVarient";
// import ViewOrderDetails from "./pages/Admin/ViewOrderDetails";

// 🔹 User Private route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// 🔹 Admin Private route wrapper
function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAdminAuth();

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return admin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Router>
            {/* ----------------- USER ROUTES ----------------- */}
            <Routes>
              <Route
                path="/*"
                element={
                  <>
                    <AppNavbar />
                    <div className="container mx-auto p-4">
                      <Routes>
                        {/* Public Pages */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* <Route
                          path="/forgotpassword"
                          element={<ForgotPassword />}
                        /> */}
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/productlist" element={<ProductList />} />
                        <Route
                          path="/category/:categoryName"
                          element={<CategoryPage />}
                        />
                        <Route
                          path="/category/:categoryName"
                          element={<CategoryProducts />}
                        />
                        <Route
                          path="/product/:id"
                          element={<ProductDetails />}
                        />
                        <Route path="/order" element={<Orders />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="orders" element={<ViewOrders />} />
                        <Route
                          path="/category/:category/:subcategory"
                          element={<SubCategoryPage />}
                        />
                        <Route path="search" element={<SearchProducts />} />
                        <Route path="/verify-otp" element={<VerifyOtp />} />
                        <Route
                          path="/order-success"
                          element={<OrderSuccessPage />}
                        />

                        {/* Protected User Routes */}
                        <Route
                          path="/wishlist"
                          element={
                            <PrivateRoute>
                              <Wishlist />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/cart"
                          element={
                            <PrivateRoute>
                              <CartPage />
                            </PrivateRoute>
                          }
                        />
                      </Routes>
                    </div>
                  </>
                }
              />

              {/* ----------------- ADMIN ROUTES ----------------- */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              {/* <Route
              path="/admin/orders/:id"
              element={
                <ProtectedAdminRoute>
                  <ViewOrderDetails/>
                  </ProtectedAdminRoute>
              }
              /> */}
              <Route
                path="/admin/addProduct"
                element={
                  <ProtectedAdminRoute>
                    <AddProduct />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/Bulk-upload"
                element={
                  <ProtectedAdminRoute>
                    <BulkUpload />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/edit-product/:id"
                element={
                  <ProtectedAdminRoute>
                    <UpdateProduct />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/coupon"
                element={
                  <ProtectedAdminRoute>
                    <AdminCoupons />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/flash-sale"
                element={
                  <ProtectedAdminRoute>
                    <AdminFlashSales />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <ProtectedAdminRoute>
                    <AdminAuditLogs />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/products/:productId/variants"
                element={
                  <ProtectedAdminRoute>
                    <ProductVariants />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminSettings />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedAdminRoute>
                    <AdminProductList />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/profile"
                element={
                  <ProtectedAdminRoute>
                    <AdminProfile />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <ProtectedAdminRoute>
                    <AdminOrders />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AdminUsers />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/forgot-password"
                element={
                  <ProtectedAdminRoute>
                    <ForgotPassword />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
