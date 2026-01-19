// src/api/axiosInstance.js
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "https://neokart-1qne.onrender.com";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 60000, // 60 seconds to avoid Render cold start timeout
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout: Backend cold start or network slow.");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
