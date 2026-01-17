  import axios from "axios";

  const BASE_URL = process.env.REACT_APP_API_URL || "https://neokart-1qne.onrender.com";

  const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 20000,
    withCredentials: true,
  });

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

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("userToken");
      }
      return Promise.reject(error);
    }
  );

  export default axiosInstance;
