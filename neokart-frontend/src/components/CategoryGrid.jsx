import React from "react";

const categories = [
  {
    name: "Electronics",
    products: [
      { name: "Smartphone", img: "https://via.placeholder.com/150" },
      { name: "Laptop", img: "https://via.placeholder.com/150" }
    ]
  },
  {
    name: "Fashion",
    products: [
      { name: "T-Shirt", img: "https://via.placeholder.com/150" },
      { name: "Shoes", img: "https://via.placeholder.com/150" }
    ]
  }
];

export default function CategoryGrid() {
  return (
    <div className="space-y-10 p-5">
      {categories.map((category, idx) => (
        <div key={idx}>
          <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {category.products.map((product, i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-lg transition">
                <img src={product.img} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
