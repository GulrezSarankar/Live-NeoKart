import axios from "axios";

// Create axios instance
const AdminApiAxiosInstance = axios.create({
  baseURL: "http://localhost:4000/api", // Note: /admin prefix
  timeout: 20000,
});

// Attach token automatically to all requests
AdminApiAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("axiosInstance: attaching token", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AdminApiAxiosInstance;
