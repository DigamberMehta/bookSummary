import React from "react";

const BookCover = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center text-center rounded-xl overflow-hidden">
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg px-4">
        AI Book Summary
      </h1>
      <p className="text-xl text-gray-200 px-4">Smart Reading Companion</p>
    </div>
  );
};

export default BookCover;
