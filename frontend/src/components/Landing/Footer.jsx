import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
          {/* Left - Brand Info */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white">Book Summaries</h2>
            <p className="mt-2 text-gray-400">
              AI-powered book insights to help you read smarter. 📚✨
            </p>
          </div>

          {/* Middle - Navigation Links */}
          <div className="flex space-x-6 md:space-x-10 text-gray-400">
            <a href="#" className="hover:text-indigo-400 transition duration-200">
              Home
            </a>
            <a href="#" className="hover:text-indigo-400 transition duration-200">
              Features
            </a>
            <a href="#" className="hover:text-indigo-400 transition duration-200">
              Explore Books
            </a>
            <a href="#" className="hover:text-indigo-400 transition duration-200">
              Contact
            </a>
          </div>

          {/* Right - Social Icons */}
          <div className="flex space-x-4 mt-6 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-200">
              <FaFacebook size={22} />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-200">
              <FaTwitter size={22} />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-200">
              <FaInstagram size={22} />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-200">
              <FaLinkedin size={22} />
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Book Summaries. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
