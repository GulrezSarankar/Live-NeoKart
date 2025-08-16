import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext"; // assuming you store logged-in user info here

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { user } = useAuth(); // ✅ get logged-in userId from auth context

  // ---------------- Fetch Cart ----------------
  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get(`/cart/me`);
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // ---------------- Add to Cart ----------------
  const addToCart = async (productId, quantity = 1) => {
    if (!user?.id) {
      console.error("User not logged in");
      return;
    }
    try {
      const res = await axiosInstance.post(`/cart/${user.id}/add`, {
        productId,
        quantity,
      });
      setCart(res.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // ---------------- Update Item ----------------
  const updateCartItem = async (productId, quantity) => {
    if (!user?.id) return;
    try {
      const res = await axiosInstance.put(`/cart/${user.id}/update/${productId}`, {
        quantity,
      });
      setCart(res.data);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // ---------------- Remove Item ----------------
  const removeFromCart = async (productId) => {
    if (!user?.id) return;
    try {
      const res = await axiosInstance.delete(`/cart/${user.id}/remove/${productId}`);
      setCart(res.data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ---------------- Clear Cart ----------------
  const clearCart = async () => {
    if (!user?.id) return;
    try {
      const res = await axiosInstance.delete(`/cart/${user.id}/clear`);
      setCart(res.data);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
