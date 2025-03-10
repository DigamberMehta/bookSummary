import React, { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import TopBar from "./TopBar";
import AudioControl from "./AudioControl";
import EditModal from "./EditModal"; // Import EditModal

const Book = ({ extractedPages, pageFlipRef, currentPage, summaries, handleAudio, playingType, audioStatus, loadingType, bookmarks, isCurrentPageBookmarked, toggleBookmark, selectedColor, setSelectedColor, colors, goToBookmark, handleFlip, bookId, bookTitle, bookCoverPage, bookEndCoverPage, handleSaveMetadataFromBook // Receive props from Home
}) => {
  const flipSoundRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Modal in Book Component
  console.log("Book Component Props:", {
    bookTitle,
    bookCoverPage,
    bookEndCoverPage
  });


  useEffect(() => {
    // Initialize flip sound
    flipSoundRef.current = new Audio("/sound/sound.mp3");
  }, []);

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
    <div className="flex flex-col items-center min-h-screen bg-[url(/background/background.jpeg)] bg-cover bg-center p-8">
      {/* Top Bar */}
      <TopBar
        colors={colors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        bookmarks={bookmarks}
        goToBookmark={goToBookmark}
      />

      {/* Book Title and Update Button - Placed Below TopBar */}
<div className="w-full max-w-4xl mx-auto mt-2 mb-4 p-4 flex flex-col items-center gap-2 backdrop-blur-sm bg-white/10 rounded-lg"> {/* Glassy effect background */}
        <button
          onClick={() => setIsModalOpen(true)} // Open modal on button click
          className="px-4 py-2 text-white rounded-md text-sm" // Button style
        >
          Update Book Details
        </button>
        <h2 className="text-4xl font-bold text-white text-center bg-transparent"> {/* Book Title Style and transparent background */}
         TITTLE :  {bookTitle}
        </h2>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTitle={bookTitle} // Use props
        initialCover={bookCoverPage} // Use props
        initialEndCover={bookEndCoverPage} // Use props
        onSave={handleSaveMetadataFromBook} // Use props and rename prop for clarity
      />

      {/* Flipbook */}
      <HTMLFlipBook
        width={550}
        height={700}
        showCover={true}
        disableFlipByClick={true}
        useMouseEvents={true}
        useTouchEvents={true}
        onFlip={(e) => {
          // Play flip sound
          if (flipSoundRef.current) {
            flipSoundRef.current.currentTime = 0; // Reset audio to start
            flipSoundRef.current.play().catch((error) => {
              console.error("Failed to play flip sound:", error);
            });
          }
          handleFlip(e);
        }}
        ref={pageFlipRef}
      >
        {/* Front Cover */}
        <div className={`w-full h-full bg-[url(${bookCoverPage})] flex flex-col items-center justify-center text-center rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat`}></div>

        {/* Content Pages */}
        {extractedPages.flatMap((page, index) => [
          // Left Page (Original)
          <div
            key={`left-${index}`}
            className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden page"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 pb-4">
              <span className="text-gray-500 font-medium">
                Page {page.pageNumber}
              </span>
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
        <div className={`w-full h-full bg-[url(${bookEndCoverPage})] flex flex-col items-center justify-center text-center rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat`}>
          <div className="bg-black bg-opacity-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-4">The End</h2>
            <p className="text-lg text-white">Continue your journey with</p>
            <p className="text-2xl text-blue-400 font-mono mt-2">
              Storybook AI
            </p>
          </div>
        </div>
      </HTMLFlipBook>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={goPrevious}
          disabled={currentPage === 0} // Disabled only on front cover
          className="px-4 py-2 bg-blue-600 text-white rounded-[50%] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <i className="fa-solid fa-chevron-left cursor-pointer"></i>
        </button>

        <span className="text-white font-medium">
          {currentPage > 0 && currentPage <= extractedPages.length
            ? `Page ${currentPage} of ${extractedPages.length}`
            : "Cover Page"}
        </span>

        <button
          onClick={goNext}
          disabled={currentPage === totalPages - 1} // Disabled only on back cover
          className="px-4 py-2 bg-blue-600 text-white rounded-[50%] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <i className="fa-solid fa-chevron-right cursor-pointer"></i>
        </button>
      </div>
    </div>
  );
};

export default Book;