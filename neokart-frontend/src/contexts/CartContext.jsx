// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasToken = useCallback(() => !!localStorage.getItem("userToken"), []);

  // FETCH user's cart (backend endpoint: GET /api/cart/me)
  const fetchCart = useCallback(async () => {
    if (!hasToken()) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/cart/me");
      setCart(res.data || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
      setError(err.response?.data || err.message);
      // if 401, optionally remove token to stop further failing calls
      if (err.response?.status === 401) {
        // localStorage.removeItem("userToken"); // uncomment to auto-clear invalid token
      }
    } finally {
      setLoading(false);
    }
  }, [hasToken]);

  // ADD item (POST /api/cart/add?productId=...&quantity=...)
  const addItem = useCallback(async (productId, quantity = 1) => {
    if (!hasToken()) throw new Error("Not authenticated");
    try {
      // controller expects request params, so pass via axios params (no JSON body)
      const res = await axiosInstance.post("/cart/add", null, {
        params: { productId, quantity },
      });
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      throw err;
    }
  }, [hasToken]);

  // UPDATE item (PUT /api/cart/update/{productId}?quantity=...)
  const updateItem = useCallback(async (productId, quantity) => {
    if (!hasToken()) throw new Error("Not authenticated");
    try {
      const res = await axiosInstance.put(`/cart/update/${productId}`, null, {
        params: { quantity },
      });
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to update item:", err);
      throw err;
    }
  }, [hasToken]);

  // REMOVE item (DELETE /api/cart/remove/{productId})
  const removeItem = useCallback(async (productId) => {
    if (!hasToken()) throw new Error("Not authenticated");
    try {
      const res = await axiosInstance.delete(`/cart/remove/${productId}`);
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
      throw err;
    }
  }, [hasToken]);

  // CLEAR cart (DELETE /api/cart/clear)
  const clearCart = useCallback(async () => {
    if (!hasToken()) throw new Error("Not authenticated");
    try {
      const res = await axiosInstance.delete("/cart/clear");
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
      throw err;
    }
  }, [hasToken]);

  // load cart on mount (or when token changes)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{ cart, loading, error, fetchCart, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
