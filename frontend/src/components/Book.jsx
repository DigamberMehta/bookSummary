import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

const Book = ({ extractedPages }) => {
  const pageFlipRef = useRef(null);

  // Ensure pages are in pairs (left: original text, right: AI summary)
  const formattedPages = extractedPages.map((page, index) => ({
    left: { content: page.text, pageNumber: index + 1 }, // Keep sequential numbering (1, 2, 3...)
    right: { summary: "AI summary coming soon..." }, // No page number for AI summary
  }));

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950 p-8 relative">
      <HTMLFlipBook
        ref={pageFlipRef}
        width={550}
        height={700}
        size="fixed"
        showCover={true}
        maxShadowOpacity={0.5}
        style={{ gap: "0px" }}
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

        {/* Content Pages (Left: Original Text, Right: AI Summary) */}
        {formattedPages.flatMap((spread, index) => [
          // Left Page (Original PDF Text) - Show Page Number
          <div
            key={`left-${index}`}
            className="w-full h-full bg-white rounded-lg shadow-lg flex flex-col justify-between p-10 page"
          >
            <div className="flex justify-between mb-6">
              <span className="text-gray-500 font-medium">
                Page {spread.left.pageNumber}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify text-sm font-serif">
              {spread.left.content}
            </p>
          </div>,

          // Right Page (AI Summary) - No Page Number
          <div
            key={`right-${index}`}
            className="w-full h-full bg-gray-100 rounded-lg shadow-lg flex flex-col justify-between p-10 page"
          >
            <div className="flex justify-between mb-6">
              <span className="text-blue-600 font-medium">Summary</span>
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
