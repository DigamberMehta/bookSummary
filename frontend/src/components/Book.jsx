import React, { useRef, useEffect, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import TopBar from "./TopBar";
import AudioControl from "./AudioControl";
import EditModal from "./EditModal";


const Book = ({ extractedPages, pageFlipRef, currentPage, summaries, handleAudio, playingType, audioStatus, loadingType, bookmarks, isCurrentPageBookmarked, toggleBookmark, selectedColor, setSelectedColor, colors, goToBookmark, handleFlip, bookId, bookTitle, bookCoverPage, bookEndCoverPage, handleSaveMetadataFromBook,
}) => {
  const flipSoundRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    flipSoundRef.current = new Audio("/sound/sound.mp3");
  }, []);

  if (!extractedPages) return null;

  const totalPages = 2 + extractedPages.length * 2;

  const goPrevious = useCallback(() => {
    pageFlipRef.current.pageFlip().flipPrev("top");
  }, [pageFlipRef]);

  const goNext = useCallback(() => {
    pageFlipRef.current.pageFlip().flipNext("top");
  }, [pageFlipRef]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        goPrevious();
      } else if (event.key === "ArrowRight") {
        goNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goPrevious, goNext]);


  // Function to create layered border lines
  const createPageLines = (side, index) => {
    const lines = [];
    const totalLayers = Math.min(index + 1, 5); // Max 5 layers per page
    for (let i = 0; i < totalLayers; i++) {
      lines.push(
        <div
          key={`${side}-line-${i}`}
          className={`page-line ${side}-line`}
          style={{
            [side]: `${(i + 1) * 3}px`, // Spacing between lines
            opacity: 1 - (i * 0.2), // Decreasing opacity for depth
            zIndex: -i, // Ensure lines stack behind each other
          }}
        />
      );
    }
    return lines;


  };
  console.log("Book Cover URL:", bookCoverPage);


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

      {/* Book Title and Update Button */}
      <div className="w-full max-w-xl mx-auto mt-2 mb-4 p-2 flex flex-col items-center gap-1 backdrop-blur-sm bg-white/10 rounded-lg">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2 py-2 text-white rounded-md text-sm"
        >
          Update Book Details
        </button>
        <h2 className="text-2xl font-bold text-white text-center bg-transparent">
          TITLE: {bookTitle}
        </h2>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTitle={bookTitle}
        initialCover={bookCoverPage}
        initialEndCover={bookEndCoverPage}
        onSave={handleSaveMetadataFromBook}
      />

      {/* Flipbook */}
      <HTMLFlipBook
        width={500}
        height={600}
        showCover={true}
        disableFlipByClick={true}
        useMouseEvents={true}
        useTouchEvents={true}
        onFlip={(e) => {
          if (flipSoundRef.current) {
            flipSoundRef.current.currentTime = 0;
            flipSoundRef.current.play().catch(console.error);
          }
          handleFlip(e);
        }}
        ref={pageFlipRef}
      >
        {/* Front Cover */}
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
  {bookCoverPage ? (
    <img 
      src={bookCoverPage} 
      alt="Book cover" 
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.style.background = '#f3f4f6';
      }}
    />
  ) : (
    <div className="text-gray-500">Loading cover...</div>
  )}
</div>


        {/* Content Pages */}
        {extractedPages.flatMap((page, index) => [
          // Left Page (Original)
          <div
            key={`left-${index}`}
            className="left-page page bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {createPageLines("left", index)}
            <div className="page-content ">
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
            </div>
          </div>,

          // Right Page (Summary)
          <div
            key={`right-${index}`}
            className="right-page page bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {createPageLines("right", index)}
            <div className="page-content ">
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
            </div>
          </div>,
        ])}

        {/* Back Cover */}
        <div className="w-full h-full flex flex-col items-center justify-center text-center rounded-lg overflow-hidden relative">
  {bookEndCoverPage ? (
    <img
      src={bookEndCoverPage}
      alt="Back cover"
      className="absolute inset-0 w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.style.background = '#f3f4f6';
      }}
    />
  ) : (
    <div className="absolute inset-0 bg-gray-100" />
  )}
 
</div>
      </HTMLFlipBook>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={goPrevious}
          disabled={currentPage === 0}
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
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-[50%] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <i className="fa-solid fa-chevron-right cursor-pointer"></i>
        </button>
      </div>
    </div>
  );
};

export default Book;