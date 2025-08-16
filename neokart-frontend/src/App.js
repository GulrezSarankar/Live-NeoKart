import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/wishlist";
import Orders from "./pages/Order";
import ProductList from "./pages/ProductList";
import CategoryPage from "./pages/category/categorypage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/cartPage";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";


// Private route wrapper
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider> {/* CartProvider inside Router so useNavigate works */}
          {/* Navbar with live cart icon */}
          <AppNavbar /> 

          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="contact" element={<Contact/>}/>


              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/productlist" element={<ProductList />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/order" element={<Orders />} />

              {/* Protected routes */}
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
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
