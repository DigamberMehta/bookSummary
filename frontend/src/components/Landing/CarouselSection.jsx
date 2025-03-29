import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarouselSection = ({ books }) => {
  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="w-[95%] mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Books
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {books.map((book, index) => (
            <div 
              key={index} 
              className="p-2 cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleBookClick(book._id)}
            >
              <div className="bg-white rounded shadow-md w-full aspect-[2/3] overflow-hidden">
                <img
                  src={book.coverPage}
                  alt={`Book ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;