import React from "react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About NeoKart</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            At NeoKart, we aim to provide you with the best shopping experience,
            offering a wide range of products, quick delivery, and reliable support.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Image */}
          <div className="flex justify-center">
            <img
              src="https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1084.jpg"
              alt="About NeoKart"
              className="rounded-lg shadow-lg w-full md:w-4/5"
            />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Who We Are
            </h2>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              NeoKart is your one-stop e-commerce platform, designed to bring
              you the latest and greatest products at unbeatable prices. With
              a focus on fast delivery, customer satisfaction, and secure
              transactions, we’re redefining online shopping for you.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800">
              Our Mission
            </h3>
            <p className="mt-2 text-gray-600">
              To make shopping simple, enjoyable, and trustworthy for everyone.
              We believe in connecting people with products they love while
              providing excellent customer support.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Our Values</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-600">Trust</h3>
              <p className="mt-3 text-gray-600">
                Your security is our priority. Every purchase is safe and
                transparent.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-600">Quality</h3>
              <p className="mt-3 text-gray-600">
                We provide only top-quality products sourced from trusted brands.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-600">Service</h3>
              <p className="mt-3 text-gray-600">
                Our support team is always ready to assist you, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
