import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

const Book = () => {
  const pageFlipRef = useRef(null);

  // Hardcoded content - each entry represents a SPREAD (left + right)
  const spreads = [
    {
      left: {
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        pageNumber: 1,
      },
      right: {
        summary:
          "This page discusses the basics of Lorem Ipsum and its usage in design and typesetting.",
        pageNumber: 2,
      },
    },
    {
      left: {
        content:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        pageNumber: 3,
      },
      right: {
        summary:
          "This page explains the concept of 'Duis aute irure dolor' and its significance.",
        pageNumber: 4,
      },
    },
    {
      left: {
        content:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        pageNumber: 5,
      },
      right: {
        summary:
          "This page explains the concept of 'Duis aute irure dolor' and its significance.",
        pageNumber: 6,
      },
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950 p-8 relative">
      {/* Book Container without gap */}
      <HTMLFlipBook
        ref={pageFlipRef}
        width={550} // Increase width slightly for seamless page alignment
        height={700}
        size="fixed"
        showCover={true}
        maxShadowOpacity={0.5}
        style={{ gap: "0px" }} // Ensure no gap in the book
      >
        {/* Cover Page */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center text-center rounded-lg">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg p-4">
            AI Book Summary
          </h1>
          <p className="text-xl text-gray-200 mt-4">
            Your Smart Book Summarizer
          </p>
        </div>

        {/* Content Pages */}
        {spreads.flatMap((spread, index) => [
          // Left Page (Original Text)
          <div
            key={`left-${index}`}
            className="w-full h-full bg-white rounded-lg shadow-lg flex flex-col justify-between p-10 page"
            style={{ borderRight: "none" }} // Remove border that was creating a gap
          >
            <div className="flex justify-between mb-6">
              <span className="text-gray-500 font-medium">
                Page {spread.left.pageNumber}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify text-lg font-serif">
              {spread.left.content}
            </p>
          </div>,

          // Right Page (AI Summary)
          <div
            key={`right-${index}`}
            className="w-full h-full bg-gray-100 rounded-lg shadow-lg flex flex-col justify-between p-10 page"
          >
            <div className="flex justify-between mb-6">
              <span className="text-blue-600 font-medium">Summary</span>
              <span className="text-gray-500 font-medium">
                Page {spread.right.pageNumber}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify text-lg font-serif">
              {spread.right.summary}
            </p>
          </div>,
        ])}
      </HTMLFlipBook>
    </div>
  );
};

export default Book;
