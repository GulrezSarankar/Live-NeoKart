import React from "react";

const BASE_URL = process.env.REACT_APP_API_URL;

const ProductList = ({ product, onClick }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center justify-center mt-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={"full" + i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L3.622 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L3.622 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={"empty" + i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L3.622 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => onClick && onClick(product)}
      className="border rounded-lg shadow hover:shadow-lg p-4 flex flex-col items-center bg-white transition-transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
      title={product.name}
    >
      <img
        src={`${BASE_URL}${product.imageUrl}`}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
        loading="lazy"
      />
      <h2 className="text-lg font-semibold text-center">{product.name}</h2>
      <p className="text-gray-500 text-sm">{product.category}</p>
      <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>
      {product.rating !== undefined && renderStars(product.rating)}
    </div>
  );
};

export default ProductList;
