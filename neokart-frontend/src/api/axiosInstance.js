// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
});

// attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // debug: short token in console (remove in production)
      console.debug("axiosInstance: attaching token", token.slice(0, 10) + "...");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// optional: log 401s for easier debugging
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("axiosInstance: received 401 Unauthorized");
      // Optionally remove token and redirect to login:
      // localStorage.removeItem("userToken");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
