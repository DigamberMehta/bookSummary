import React from "react";
import HTMLFlipBook from "react-pageflip";
import TopBar from "./TopBar";
import AudioControl from "./AudioControl";

const Book = ({ extractedPages, pageFlipRef, currentPage, summaries, handleAudio, playingType, audioStatus, loadingType, bookmarks, isCurrentPageBookmarked, toggleBookmark, selectedColor, setSelectedColor, colors, goToBookmark, handleFlip,
}) => {
  if (!extractedPages) return null;

  // Total pages including covers (2 covers + 2 * content pages)
  const totalPages = 2 + extractedPages.length * 2;

  // Navigation functions
  const goPrevious = () => {
    pageFlipRef.current.pageFlip().flipPrev("top");
  };

  const goNext = () => {
    pageFlipRef.current.pageFlip().flipNext("top");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[url(/Users/digamber/Desktop/Book_Summary/frontend/src/assets/AdobeStock_302040655.jpeg)] bg-cover bg-center p-8">
      {/* Top Bar */}
      <TopBar
        colors={colors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        bookmarks={bookmarks}
        goToBookmark={goToBookmark}
      />

      {/* Flipbook */}
        <HTMLFlipBook
        width={550}
        height={700}
        showCover={true}
        disableFlipByClick={true}    
        useMouseEvents={true}      
        useTouchEvents={true}      
        onFlip={handleFlip}
        ref={pageFlipRef}
      >
        {/* Front Cover */}
        <div className="w-full h-full bg-[url(https://miblart.com/wp-content/uploads/2020/08/ZXAfJR0M-663x1024-1.jpg)] flex flex-col items-center justify-center text-center rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat">
         
        </div>

        {/* Content Pages */}
        {extractedPages.flatMap((page, index) => [
          // Left Page (Original)
          <div
            key={`left-${index}`}
            className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden page"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 pb-4">
              <span className="text-gray-500 font-medium">Page {page.pageNumber}</span>
              <AudioControl
                text={page.text}
                type="book"
                handleAudio={handleAudio}
                playingType={playingType}
                audioStatus={audioStatus}
                loadingType={loadingType}
                isBookmarked={isCurrentPageBookmarked()}
                toggleBookmark={toggleBookmark}
              />
            </div>
            <div className="flex-1 overflow-auto px-6 pb-6">
              <p className="text-gray-700 leading-relaxed text-justify text-xs">
                {page.text}
              </p>
            </div>
          </div>,

          // Right Page (Summary)
          <div
            key={`right-${index}`}
            className="w-full h-full bg-gray-50 flex flex-col rounded-xl overflow-hidden page"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 pb-4">
              <span className="text-blue-500 font-medium">AI Summary</span>
              <AudioControl
                text={summaries[page.pageNumber]}
                type="summary"
                handleAudio={handleAudio}
                playingType={playingType}
                audioStatus={audioStatus}
                loadingType={loadingType}
              />
            </div>
            <div className="flex-1 overflow-auto px-6 pb-6">
              <p className="text-gray-700 leading-relaxed text-justify text-xs">
                {summaries[page.pageNumber] || (
                  <span className="text-gray-400">Generating summary...</span>
                )}
              </p>
            </div>
          </div>,
        ])}

        {/* Back Cover */}
        <div className="w-full h-full bg-[url(https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80)] flex flex-col items-center justify-center text-center rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat">
          <div className="bg-black bg-opacity-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-4">The End</h2>
            <p className="text-lg text-white">Continue your journey with</p>
            <p className="text-2xl text-blue-400 font-mono mt-2">Storybook AI</p>
          </div>
        </div>
      </HTMLFlipBook>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={goPrevious}
          disabled={currentPage === 0} // Disabled only on front cover
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <span className="text-white font-medium">
          {currentPage > 0 && currentPage <= extractedPages.length
            ? `Page ${currentPage} of ${extractedPages.length}`
            : "Cover Page"}
        </span>

        <button
          onClick={goNext}
          disabled={currentPage === totalPages - 1} // Disabled only on back cover
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Book;