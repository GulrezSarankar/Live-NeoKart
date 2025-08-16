import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.jpeg";
import ProductCard from "../components/ProductCard";

import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [topRated, setTopRated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [stockFilter, setStockFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);

  const productsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/products")
      .then((res) => setProducts(res.data.content))
      .catch((err) => console.error(err));
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.product.category))];

  const filteredProducts = products
    .filter(
      (item) =>
        item.product.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory === "all" || item.product.category === selectedCategory) &&
        item.product.price >= priceRange[0] &&
        item.product.price <= priceRange[1] &&
        (stockFilter === "all" ||
          (stockFilter === "in" && item.product.stock > 0) ||
          (stockFilter === "out" && item.product.stock === 0)) &&
        item.averageRating >= ratingFilter
    )
    .sort((a, b) => (topRated ? b.averageRating - a.averageRating : 0));

  const featuredProducts = [...products]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  const heroImages = [
    { img: banner1, title: "Latest Laptops", subtitle: "High Performance", buttonText: "Shop Now" },
    { img: banner2, title: "Smart Accessories", subtitle: "Enhance Your Devices", buttonText: "Shop Now" },
    { img: banner3, title: "Top Deals", subtitle: "Best Prices Just For You", buttonText: "Shop Now" },
  ];

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const viewProductDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 sticky top-0 bg-white z-20">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Hero Slider */}
      <div className="w-full mb-10 relative">
        <Slider {...sliderSettings}>
          {heroImages.map((slide, index) => (
            <div key={index} className="relative">
              <img src={slide.img} alt={slide.title} className="w-full h-64 md:h-96 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{slide.title}</h2>
                <p className="mb-4 text-md md:text-lg">{slide.subtitle}</p>
                <button
                  onClick={scrollToProducts}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Top Featured Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((item) => (
            <ProductCard
              key={item.product.id}
              product={item.product}
              rating={item.averageRating}
              onViewDetails={() => viewProductDetails(item.product)}
            />
          ))}
        </div>
      </div>

      {/* Filters & Products */}
      <div ref={productsRef} className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-6 flex-1">
        <div
          className={`w-full lg:w-64 bg-gray-50 p-4 rounded-lg transition-all duration-500 ${
            showFilters ? "h-auto" : "h-14 overflow-hidden"
          }`}
        >
          <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
            <h3 className="font-semibold text-lg">Filters</h3>
            <span>{showFilters ? "-" : "+"}</span>
          </div>
          {showFilters && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Price: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Stock:</label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Rating:</label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value={0}>All Ratings</option>
                  <option value={1}>1★ & up</option>
                  <option value={2}>2★ & up</option>
                  <option value={3}>3★ & up</option>
                  <option value={4}>4★ & up</option>
                  <option value={5}>5★</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">All Products</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTopRated(!topRated)}
                className={`px-4 py-2 rounded ${topRated ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {topRated ? "Showing Top Rated" : "Top Rated"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item.product.id}
                  product={item.product}
                  rating={item.averageRating}
                  onViewDetails={() => viewProductDetails(item.product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around py-2 lg:hidden z-30">
        <button className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 12l9-9 9 9v9a3 3 0 01-3 3h-12a3 3 0 01-3-3v-9z" />
          </svg>
          Home
        </button>
        <button className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
          </svg>
          Category
        </button>
        <button className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 4h10v2H7V4zm-4 4h18v14H3V8zm2 2v10h14V10H5z" />
          </svg>
          Cart
        </button>
        <button className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Profile
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Footer Component with icons
const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">NeoKart</h3>
          <p className="text-gray-400 text-sm">
            Your one-stop e-commerce platform. Shop the latest products, enjoy fast delivery, and stay updated with our new collections.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition text-xl"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition text-xl"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition text-xl"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} NeoKart. All rights reserved.
      </div>
    </footer>
  );
};


export default Home;
