import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

const AdminApiAxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 20000,
  withCredentials: true,
});

AdminApiAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AdminApiAxiosInstance;
