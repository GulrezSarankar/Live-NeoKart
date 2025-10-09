import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

// --- SVG Icons for Contact Info ---
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

// --- Main Contact Component ---
const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // --- Form Logic (Backend call unchanged) ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/contact/save", formData);
      if (response.status === 200 || response.status === 201) {
        setStatus({ type: "success", message: "Your message has been sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Animation Variants ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* --- Hero Section --- */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Contact Us
          </motion.h1>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Have a question or feedback? Our team is ready to assist you.
          </motion.p>
        </div>
      </motion.section>

      {/* --- Contact Form + Info Section --- */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Left - Form */}
          <motion.div 
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            <AnimatePresence>
              {status.message && <Alert type={status.type} message={status.message} />}
            </AnimatePresence>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <InputField type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
              <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
              <InputField type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
              <TextareaField name="message" value={formData.message} onChange={handleChange} placeholder="Write your message..." required />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
            <ContactInfoItem icon={<LocationIcon />} title="Our Address" text="123 NeoKart Street, Pune, Maharashtra, India" />
            <ContactInfoItem icon={<EmailIcon />} title="Email Us" text="support@neokart.com" />
            <ContactInfoItem icon={<PhoneIcon />} title="Call Us" text="+91 98765 43210" />
            <div className="mt-8">
              <iframe
                title="NeoKart Location"
                className="w-full h-64 rounded-xl shadow-lg filter grayscale hover:grayscale-0 transition-all duration-300"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.78010083238!2d73.7164478140325!3d18.52456488422403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1663248865321!5m2!1sen!2sin"
                allowFullScreen="" loading="lazy">
              </iframe>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// --- Reusable Sub-Components for a Cleaner UI ---

const InputField = (props) => (
  <input {...props} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
);

const TextareaField = (props) => (
  <textarea {...props} rows="4" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
);

const ContactInfoItem = ({ icon, title, text }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{text}</p>
    </div>
  </div>
);

const Alert = ({ type, message }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-3 mb-4 rounded-lg text-sm ${isSuccess ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}
    >
      {message}
    </motion.div>
  );
};

export default Contact;