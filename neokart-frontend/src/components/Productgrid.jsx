import React from "react";

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-300"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
          <p className="text-gray-600">{product.category}</p>
          <p className="font-bold text-blue-500">₹{product.price}</p>

        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
