import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PDFUpload from "./PDFUpload";
import FeaturesSection from "./FeaturesSection";
import CarouselSection from "./CarouselSection";
import Banner from "./Banner";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const LandingPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch books from API
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/books");
        setBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            Get Quick, Insightful Summaries of Your Favorite Books
          </h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Start Summarizing Now
          </button>
        </div>
      </section>

      {/* PDF Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-2xl rounded-xl bg-gray-900 p-8 shadow-2xl">
            <PDFUpload
              onFileSelect={(bookId) => {
                setShowUploadModal(false);
                navigate(`/book/${bookId}`); // Navigate to book route with ID
              }}
            />
            <button
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-200"
              onClick={() => setShowUploadModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
          </div>
        </div>
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Carousel Section */}
      <CarouselSection  books={books} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;