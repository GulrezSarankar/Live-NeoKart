import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

// Simple SVG Icons for the values section (you can replace these with your preferred icon library)
const TrustIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const QualityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
const ServiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17z" />
  </svg>
);

const About = () => {
  // Animation variants for Framer Motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* --- Hero Section --- */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20 md:py-28 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="text-4xl md:text-6xl font-extrabold tracking-tight">
            About NeoKart
          </motion.h1>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            We're on a mission to revolutionize your shopping experience by blending technology, quality, and exceptional service.
          </motion.p>
        </div>
      </motion.section>

      {/* --- "Who We Are" Section --- */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1084.jpg"
              alt="Our Mission at NeoKart"
              className="rounded-xl shadow-2xl w-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Who We Are
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              NeoKart is your one-stop e-commerce platform, designed to bring you the latest products at unbeatable prices. With a focus on fast delivery, customer satisfaction, and secure transactions, we’re redefining online shopping.
            </p>
            <div className="mt-6 border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Our Mission
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                To make shopping simple, enjoyable, and trustworthy for everyone. We connect people with products they love while providing excellent customer support.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- "Our Values" Section --- */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Our Core Values
          </motion.h2>
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <ValueCard
              icon={<TrustIcon />}
              title="Trust"
              description="Your security is our priority. Every purchase is safe, secure, and transparent."
            />
            <ValueCard
              icon={<QualityIcon />}
              title="Quality"
              description="We are committed to providing only top-quality products sourced from trusted brands."
            />
            <ValueCard
              icon={<ServiceIcon />}
              title="Service"
              description="Our dedicated support team is always ready to assist you with any questions, anytime."
            />
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Reusable Value Card Component
const ValueCard = ({ icon, title, description }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mx-auto">
        {icon}
      </div>
      <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

export default About;