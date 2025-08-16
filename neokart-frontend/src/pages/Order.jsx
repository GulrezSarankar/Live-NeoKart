import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/api/orders/my");
        setOrders(res.data);
      } catch (e) {
        alert("Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
          <h3 className="mt-2 font-semibold">Items:</h3>
          <ul className="list-disc pl-5">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.product.name} x {item.quantity} @ ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
