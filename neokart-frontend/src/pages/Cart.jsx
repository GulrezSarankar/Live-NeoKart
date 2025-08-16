import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/cart/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading cart...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="text-center py-10">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between items-center border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:4000${item.imageUrl}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">₹{item.unitPrice}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">₹{item.lineTotal}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-10 border-t pt-6 space-y-2 text-lg">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{cart.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>₹{cart.shipping}</span>
        </div>
        <div className="flex justify-between font-bold text-xl">
          <span>Total:</span>
          <span>₹{cart.total}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-8 text-right">
        <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
