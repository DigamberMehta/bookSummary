import React from "react";
import HTMLFlipBook from "react-pageflip";
import TopBar from "./TopBar";
import AudioControl from "./AudioControl";

const Book = ({
  extractedPages,
  pageFlipRef,
  currentPage,
  summaries,
  handleAudio,
  playingType,
  audioStatus,
  loadingType,
  // Bookmarks
  bookmarks,
  isCurrentPageBookmarked,
  toggleBookmark,
  selectedColor,
  setSelectedColor,
  colors,
  goToBookmark,
  // Flip event
  handleFlip,
}) => {
  if (!extractedPages) return null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-8">
      {/* Top Bar */}
      <TopBar
        colors={colors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        bookmarks={bookmarks}
        goToBookmark={goToBookmark}
      />
        <HTMLFlipBook
          ref={pageFlipRef}
          width={550}
          height={700}
          maxShadowOpacity={0.3}
          showCover={true}
          onFlip={handleFlip}
          
        >

        {/* Cover Page */}
        <div className="w-full h-full bg-[url(https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg)] flex flex-col items-center justify-center text-center rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat">
          
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
      </HTMLFlipBook>
    </div>
  );
};

export default Book;
