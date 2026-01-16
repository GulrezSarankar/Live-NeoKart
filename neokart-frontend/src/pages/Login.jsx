// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginIllustration from "../assets/login-illustration.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("userName", response.data.name);

        toast.success(`🎉 Welcome ${response.data.name}!`, {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });

        setTimeout(() => {
          if (response.data.role === "ADMIN") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        toast.error("Invalid login credentials", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error("Login failed. Please check your email & password.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-orange-500 mb-6">Logo Here</h1>
          <h2 className="text-lg text-gray-600 mb-1">Welcome back !!!</h2>
          <h3 className="text-3xl font-bold mb-6">Sign in</h3>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <div className="text-right mt-1">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-500 hover:text-orange-500"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              SIGN IN
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            I don’t have an account?{" "}
            <Link to="/register" className="text-orange-500 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="hidden md:flex w-1/2 bg-orange-50 items-center justify-center">
          <img
            src={loginIllustration}
            alt="Shopping Illustration"
            className="max-w-sm"
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
