// src/components/LandingPage.jsx
import React from 'react';
import Slider from 'react-slick';

 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LandingPage = () => {
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,     
    slidesToScroll: 1,
    autoplay: true,     
    autoplaySpeed: 3000, 
    responsive: [
      {
        breakpoint: 1024,  
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,  // Below 640px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-white shadow-md">
        <nav className="flex items-center justify-between px-4 py-4 md:px-8">
          <div className="text-2xl font-bold text-gray-800">
            Book Summaries
          </div>
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
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Tired of reading lengthy books without truly capturing their essence? Our summarized highlights help you absorb key insights in minutes.
          </p>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-700 transition duration-200">
            Start Summarizing Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-100 p-6 rounded shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Summaries in Seconds</h3>
              <p className="text-gray-600">
                Our AI-powered engine processes entire books and gives you concise summaries in seconds.
              </p>
            </div>
            <div className="bg-indigo-100 p-6 rounded shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Save Time & Effort</h3>
              <p className="text-gray-600">
                Gain valuable insights quickly without needing to read through hundreds of pages.
              </p>
            </div>
            <div className="bg-indigo-100 p-6 rounded shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Customize Focus</h3>
              <p className="text-gray-600">
                Highlight the sections you care about or dive deeper into chapters that interest you most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Carousel Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured Books
          </h2>

          <Slider {...settings}>
            {/* Slide 1 */}
            <div className="p-4">
              <div className="bg-white rounded shadow-md h-full flex flex-col items-center p-4">
                <img
                  src="https://via.placeholder.com/120x180"
                  alt="Book 1"
                  className="mb-4 w-32 h-48 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Book Title One
                </h3>
                <p className="text-gray-600 text-sm">
                  A quick description of this book. Discover its main themes and highlights.
                </p>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="p-4">
              <div className="bg-white rounded shadow-md h-full flex flex-col items-center p-4">
                <img
                  src="https://via.placeholder.com/120x180"
                  alt="Book 2"
                  className="mb-4 w-32 h-48 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Book Title Two
                </h3>
                <p className="text-gray-600 text-sm">
                  Another exciting book – get quick insights and summaries with ease.
                </p>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="p-4">
              <div className="bg-white rounded shadow-md h-full flex flex-col items-center p-4">
                <img
                  src="https://via.placeholder.com/120x180"
                  alt="Book 3"
                  className="mb-4 w-32 h-48 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Book Title Three
                </h3>
                <p className="text-gray-600 text-sm">
                  Dive into the essential lessons from this popular read in just a few minutes.
                </p>
              </div>
            </div>

            {/* Slide 4 */}
            <div className="p-4">
              <div className="bg-white rounded shadow-md h-full flex flex-col items-center p-4">
                <img
                  src="https://via.placeholder.com/120x180"
                  alt="Book 4"
                  className="mb-4 w-32 h-48 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Book Title Four
                </h3>
                <p className="text-gray-600 text-sm">
                  Gain a fresh perspective with an overview of key takeaways.
                </p>
              </div>
            </div>
            
            {/* Add more slides as needed */}
          </Slider>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8">
            Sign up now and dive into the summaries of thousands of popular books.
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition duration-200">
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white px-4 py-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Book Summaries. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
