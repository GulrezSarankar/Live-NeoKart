import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug("axiosInstance: attaching token", token.slice(0, 10) + "...");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("axiosInstance: received 401 Unauthorized");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
