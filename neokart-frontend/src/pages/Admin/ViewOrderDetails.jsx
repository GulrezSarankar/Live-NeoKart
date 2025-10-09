// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ArrowLeft, Truck, User, Package } from "lucide-react";

// export default function ViewOrderDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await axios.get(`http://localhost:4000/api/orders/${id}`, {
//           withCredentials: true,
//         });
//         setOrder(res.data);
//       } catch (err) {
//         console.error("Error fetching order:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [id]);

//   if (loading) return <div className="p-8 text-center text-gray-600">Loading order details...</div>;
//   if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-6">
//       {/* Back Button */}
//       <div className="mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition"
//         >
//           <ArrowLeft size={20} /> Back to Orders
//         </button>
//       </div>

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
//         <span
//           className={`px-4 py-2 rounded-full text-sm font-semibold ${
//             order.status === "DELIVERED"
//               ? "bg-green-100 text-green-700"
//               : order.status === "PENDING"
//               ? "bg-yellow-100 text-yellow-700"
//               : "bg-blue-100 text-blue-700"
//           }`}
//         >
//           {order.status}
//         </span>
//       </div>

//       {/* Customer Details */}
//       <div className="bg-gray-50 rounded-xl p-5 mb-6">
//         <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
//           <User /> Customer Details
//         </h2>
//         <div className="grid md:grid-cols-2 gap-4">
//           <p><strong>Name:</strong> {order.user?.name}</p>
//           <p><strong>Email:</strong> {order.user?.email}</p>
//           <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
//           <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Shipping Info */}
//       <div className="bg-gray-50 rounded-xl p-5 mb-6">
//         <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
//           <Truck /> Shipping Address
//         </h2>
//         <p>{order.shippingAddress?.name}</p>
//         <p>{order.shippingAddress?.address}</p>
//         <p>
//           {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
//           {order.shippingAddress?.zip}, {order.shippingAddress?.country}
//         </p>
//       </div>

//       {/* Order Items */}
//       <div className="bg-gray-50 rounded-xl p-5 mb-6">
//         <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
//           <Package /> Ordered Items
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="px-4 py-2">#</th>
//                 <th className="px-4 py-2">Product</th>
//                 <th className="px-4 py-2">Price</th>
//                 <th className="px-4 py-2">Quantity</th>
//                 <th className="px-4 py-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.items?.map((item, index) => (
//                 <tr key={item.id} className="border-t">
//                   <td className="px-4 py-2">{index + 1}</td>
//                   <td className="px-4 py-2">{item.product?.name}</td>
//                   <td className="px-4 py-2">₹{item.product?.price}</td>
//                   <td className="px-4 py-2">{item.quantity}</td>
//                   <td className="px-4 py-2">
//                     ₹{(item.product?.price * item.quantity).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="flex justify-between items-center bg-gray-100 p-5 rounded-xl">
//         <h2 className="text-xl font-semibold">Total Amount:</h2>
//         <p className="text-2xl font-bold text-green-600">₹{order.totalPrice}</p>
//       </div>
//     </div>
//   );
// }
