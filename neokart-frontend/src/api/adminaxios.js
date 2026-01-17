import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://neokart-1qne.onrender.com";

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

AdminApiAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
    }
    return Promise.reject(error);
  }
);

export default AdminApiAxiosInstance;
