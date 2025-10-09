import React from "react";

export default function SearchBar({ setSearch }) {
  return (
    <div className="flex flex-wrap justify-between items-center p-4 bg-gray-100">
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-1/2"
      />
      <div className="flex gap-2 mt-2 md:mt-0">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">All</button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Electronics</button>
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">Fashion</button>
      </div>
    </div>
  );
}
