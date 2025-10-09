// src/api/productApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/products";

export const fetchAllProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/all`);
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories`);
  return res.data;
};
