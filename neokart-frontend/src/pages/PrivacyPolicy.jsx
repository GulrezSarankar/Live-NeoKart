// src/pages/PrivacyPolicy.jsx
import React, { useState, useEffect, useMemo } from "react"; // ✅ 1. Import useMemo
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  // ✅ 2. Wrap the sections array in useMemo
  // This ensures the array is created only once and doesn't trigger the useEffect on every render.
  const sections = useMemo(
    () => [
      {
        id: "introduction",
        title: "1. Introduction",
        content:
          "Welcome to NeoKart. We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all information collected through our website and any related services, sales, marketing, or events. By using our services, you agree to the collection and use of information in accordance with this policy.",
      },
      {
        id: "information-collection",
        title: "2. Information We Collect",
        content: (
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Personal Information You Disclose to Us:</strong> We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us. This may include your name, address, email address, and phone number.
            </li>
            <li>
              <strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by our payment processor.
            </li>
            <li>
              <strong>Information Automatically Collected:</strong> We automatically collect certain information when you visit, use, or navigate the website. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, and other technical information.
            </li>
          </ul>
        ),
      },
      {
        id: "information-use",
        title: "3. How We Use Your Information",
        content:
          "We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. These purposes include facilitating account creation, processing orders, sending administrative information, and delivering targeted advertising.",
      },
      {
        id: "data-sharing",
        title: "4. Will Your Information Be Shared?",
        content:
          "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. We do not sell, rent, or trade any of your personal information with any third parties for their promotional purposes.",
      },
      {
        id: "data-security",
        title: "5. How We Keep Your Information Safe",
        content:
          "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.",
      },
      {
        id: "policy-updates",
        title: "6. Updates to This Policy",
        content: `We may update this privacy policy from time to time. The updated version will be indicated by a "Last updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.`,
      },
      {
        id: "contact-us",
        title: "7. How to Contact Us",
        content: (
          <p>
            If you have questions or comments about this policy, you may email us at{" "}
            <a href="mailto:support@neokart.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@neokart.com
            </a>{" "}
            or by post to: NeoKart, 123 Tech Park, Pune, Maharashtra, India.
          </p>
        ),
      },
    ],
    [] // ✅ 3. Add an empty dependency array so it only runs once.
  );

  // Effect for scroll-spy active link highlighting
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let currentSection = "";
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]); // Now this dependency is stable and won't cause re-renders.

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-950/20 transition-colors duration-500 min-h-screen">
      {/* --- Header Section --- */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-indigo-900 py-16 sm:py-20 text-center shadow-lg">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          className="mt-3 text-lg text-blue-100 dark:text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Your trust, our priority. Understanding how we protect your data.
        </motion.p>
        <motion.p
          className="mt-1 text-sm text-blue-200 dark:text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Last updated: September 15, 2025
        </motion.p>
      </header>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-4 lg:gap-10">
          {/* Left - Sticky Navigation */}
          <nav className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contents</p>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`group flex items-center px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-in-out
                        ${activeSection === section.id
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                        }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-3 ${activeSection === section.id ? 'bg-white' : 'bg-blue-400 group-hover:bg-blue-600 dark:bg-gray-500 dark:group-hover:bg-blue-400'}`}></span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Right - Policy Content */}
          <main className="lg:col-span-3">
            <div className="space-y-12">
              {sections.map((section) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-400 mb-5 border-b-2 border-blue-200 dark:border-gray-700 pb-3">
                    {section.title}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    {section.content}
                  </div>
                </motion.section>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;