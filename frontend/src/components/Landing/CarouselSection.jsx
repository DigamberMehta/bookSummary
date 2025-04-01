import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarouselSection = ({ books }) => {
  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-3">
            Featured Collections
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {books.map((book, index) => (
            <div 
              key={index} 
              className="group relative cursor-pointer"
              onClick={() => handleBookClick(book._id)}
            >
              <div className="aspect-[2/3] bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                <img
                  src={book.coverPage}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-102"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-medium truncate text-shadow-sm">{book.title}</h3>
                    <p className="text-sm opacity-90 truncate">{book.author}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;