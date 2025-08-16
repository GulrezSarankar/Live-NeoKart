import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const CartPage = () => {
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null); // To disable buttons while updating

  useEffect(() => {
    if (!user || !token) return; // No cart if not logged in or no token

    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:4000/api/cart/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load cart");
        const data = await res.json();
        setCart(data);
      } catch (err) {
        setError(err.message || "Error fetching cart");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [user, token]);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1 || updatingProductId === productId) return;
    setUpdatingProductId(productId);
    try {
      const res = await fetch(
        `http://localhost:4000/api/cart/update?productId=${productId}&quantity=${newQty}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to update quantity");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeItem = async (productId) => {
    if (updatingProductId === productId) return;
    setUpdatingProductId(productId);
    try {
      const res = await fetch(
        `http://localhost:4000/api/cart/remove?productId=${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to remove item");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your cart...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;

  if (!cart || !cart.items || cart.items.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-6">
        {cart.items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border-b pb-4"
          >
            <img
              src={
                product.imageUrl.startsWith("http")
                  ? product.imageUrl
                  : `http://localhost:4000${product.imageUrl}`
              }
              alt={product.name}
              className="w-24 h-24 object-contain rounded"
            />
            <div className="flex-grow">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-indigo-600 font-semibold">
                ₹{product.price.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={updatingProductId === product.id}
                aria-label={`Decrease quantity of ${product.name}`}
              >
                -
              </button>
              <span className="px-3">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={updatingProductId === product.id}
                aria-label={`Increase quantity of ${product.name}`}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(product.id)}
              className="ml-4 text-red-600 hover:text-red-800"
              aria-label={`Remove ${product.name} from cart`}
              disabled={updatingProductId === product.id}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center font-bold text-xl">
        <p>Total: ₹{totalPrice.toLocaleString()}</p>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
          onClick={() => alert("Checkout not implemented yet!")}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
