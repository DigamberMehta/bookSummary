import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PDFUpload from "./PDFupload";
import FeaturesSection from "./FeaturesSection";
import CarouselSection from "./CarouselSection";
import Banner from "./Banner";
import Header from "./Header"; // Assuming Header.js is in the same directory
import Footer from "./Footer";
import axios from "axios";
import TeamSection from "./TeamSection";


const LandingPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("https://booksummary.onrender.com/api/books");
        setBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-28">
        <div className="max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
              Transform Reading with <span className="text-indigo-600">AI-Powered</span> Summaries
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant, insightful summaries of any book in minutes, not hours
            </p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Start Summarizing Now
            </button>
            <button
              className="px-8 py-3.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* PDF Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
            <button
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowUploadModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <PDFUpload
              onFileSelect={(bookId) => {
                setShowUploadModal(false);
                navigate(`/book/${bookId}`);
              }}
            />
          </div>
        </div>
      )}

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Carousel Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-6">
        <CarouselSection books={books} />
      </div>

      <TeamSection />


      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;