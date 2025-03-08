import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PDFUpload from './PDFUpload';
import FeaturesSection from './FeaturesSection';
import CarouselSection from './CarouselSection';

const LandingPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-white shadow-md">
        <nav className="flex items-center justify-between px-4 py-4 md:px-8">
          <div className="text-2xl font-bold text-gray-800">Book Summaries</div>
          <div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200">
              Sign In
            </button>
          </div>
        </nav>
      </header>

      <section className="flex-1 flex items-center justify-center bg-indigo-50 px-4 py-16">
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
              onFileSelect={(pages) => {
                setShowUploadModal(false);
                navigate('/', { state: { extractedPages: pages } });
              }}
            />
            <button
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-200"
              onClick={() => setShowUploadModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Carousel Section */}
      <CarouselSection />

      {/* Footer */}
      <footer className="bg-gray-800 text-white px-4 py-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Book Summaries. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
