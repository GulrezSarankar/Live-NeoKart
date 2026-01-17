import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.png";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const navigate = useNavigate();

  // ✅ Fetch products from live backend (no localhost)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        const list = Array.isArray(res?.data?.content)
          ? res.data.content
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setProducts(list);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Sorting
  const sortedProducts = [...products].sort((a, b) => {
    const pa = a.product || a;
    const pb = b.product || b;
    if (sortOption === "price-asc") return pa.price - pb.price;
    if (sortOption === "price-desc") return pb.price - pa.price;
    return 0;
  });

  const viewProductDetails = (product) => navigate(`/product/${product.id}`);
  const handleAddToCart = (product) =>
    alert(`🛒 ${product.name} added to cart!`);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-500">
      <HeroSlider />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SortSection
          sortOption={sortOption}
          setSortOption={setSortOption}
          variants={sectionVariants}
        />

        <NewArrivalsGrid
          loading={loading}
          products={sortedProducts}
          onViewDetails={viewProductDetails}
          onAddToCart={handleAddToCart}
          sectionVariants={sectionVariants}
          itemVariants={gridItemVariants}
        />
      </main>

      <ScrollToTopButton />
      <Footer />
    </div>
  );
}

// ✅ Hero Slider
const HeroSlider = () => {
  const heroImages = [
    { img: banner1, title: "Elevate Your Workspace", subtitle: "Discover premium electronics for modern professionals.", cta: "Shop Now" },
    { img: banner2, title: "Seamless Connectivity", subtitle: "High-performance accessories for every device.", cta: "Explore Collection" },
    { img: banner3, title: "Limited Time Offers", subtitle: "Unbeatable deals on top-rated tech.", cta: "View Deals" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="relative w-full h-[50vh] md:h-[65vh] mb-8">
      <Slider {...settings}>
        {heroImages.map((slide, idx) => (
          <div key={idx} className="relative h-[50vh] md:h-[65vh]">
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 sm:p-12">
              <h2 className="text-white text-3xl sm:text-4xl font-extrabold">{slide.title}</h2>
              <p className="text-white/80 mt-2 mb-6 max-w-lg">{slide.subtitle}</p>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </motion.section>
  );
};

const SortSection = ({ sortOption, setSortOption, variants }) => (
  <motion.section variants={variants} initial="hidden" whileInView="visible"
    className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl shadow-sm mb-8">
    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}
      className="w-full md:w-1/3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg">
      <option value="default">Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  </motion.section>
);

const NewArrivalsGrid = ({ loading, products, onViewDetails, onAddToCart, sectionVariants, itemVariants }) => (
  <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" className="mb-12">
    <h3 className="text-2xl font-bold mb-4">🆕 New Arrivals</h3>
    {loading ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    ) : (
      <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
        {products.map((item, i) => {
          const product = item.product || item;
          return (
            <motion.div key={i} variants={itemVariants}>
              <ProductCard
                product={product}
                rating={item.averageRating}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          );
        })}
      </motion.div>
    )}
  </motion.section>
);

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12">
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const SkeletonCard = () => (
  <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
    <div className="w-full h-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);
