// components/Book.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import Bookmark from "./Bookmark";
import AudioControl from "./AudioControl";
import EditModal from "./EditModal";
import Sidebar from "./Sidebar";
import Chatbot from "./ChatBot/Chatbot";

const Book = ({ extractedPages, pageFlipRef, currentPage, summaries, handleAudio, playingType, audioStatus, loadingType, bookmarks, isCurrentPageBookmarked, toggleBookmark, selectedColor, setSelectedColor, colors, goToBookmark, handleFlip, bookId, bookTitle, bookCoverPage, bookEndCoverPage, handleSaveMetadataFromBook, selectedVoice, handleVoiceChange,
}) => {
  const flipSoundRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVisiblePageText, setCurrentVisiblePageText] = useState('');
  const [pagesReadCounter, setPagesReadCounter] = useState(0);
  const [readPages, setReadPages] = useState(new Set());

  // Progress calculation
  const progressPercentage = extractedPages.length > 0
    ? Math.round((pagesReadCounter / extractedPages.length) * 100)
    : 0;

  useEffect(() => {
    flipSoundRef.current = new Audio("/sound/sound.mp3");
    if (extractedPages?.length > 0) {
      setCurrentVisiblePageText(extractedPages[0].text);
    }
  }, [extractedPages]);

  useEffect(() => {
    const storedPagesRead = localStorage.getItem(`book-${bookId}-pagesRead`);
    const storedReadPages = localStorage.getItem(`book-${bookId}-readPages`);

    if (storedPagesRead) setPagesReadCounter(parseInt(storedPagesRead, 10));
    if (storedReadPages) setReadPages(new Set(JSON.parse(storedReadPages)));
  }, [bookId]);

  useEffect(() => {
    localStorage.setItem(`book-${bookId}-pagesRead`, pagesReadCounter);
    localStorage.setItem(`book-${bookId}-readPages`, JSON.stringify(Array.from(readPages)));
  }, [pagesReadCounter, readPages, bookId]);

  const goPrevious = useCallback(() => pageFlipRef.current.pageFlip().flipPrev("top"), [pageFlipRef]);
  const goNext = useCallback(() => pageFlipRef.current.pageFlip().flipNext("top"), [pageFlipRef]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goPrevious, goNext]);

  const handlePageChange = (e) => {
    handleFlip(e);
    const currentPageNumber = e.data;

    if (currentPageNumber % 2 === 1) {
      const contentPageIndex = Math.floor((currentPageNumber - 1) / 2);
      if (contentPageIndex >= 0 && contentPageIndex < extractedPages.length) {
        const pageNumber = extractedPages[contentPageIndex].pageNumber;
        setCurrentVisiblePageText(extractedPages[contentPageIndex].text);

        if (!readPages.has(pageNumber)) {
          setPagesReadCounter(prev => prev + 1);
          setReadPages(prev => new Set([...prev, pageNumber]));
        }
      }
    }
  };

  const resetProgress = () => {
    setPagesReadCounter(0);
    setReadPages(new Set());
  };

  const createPageLines = (side, index) => {
    return Array.from({ length: Math.min(index + 1, 5) }).map((_, i) => (
      <div
        key={`${side}-line-${i}`}
        className={`page-line ${side}-line`}
        style={{
          [side]: `${(i + 1) * 3}px`,
          opacity: 1 - (i * 0.2),
          zIndex: -i,
        }}
      />
    ));
  };

  if (!extractedPages) return null;

  return (
    <div className="flex min-h-screen bg-[url(/background/background.jpeg)] bg-cover bg-center p-4 relative">
      <Sidebar selectedVoice={selectedVoice} handleVoiceChange={handleVoiceChange} />

      <div className="flex flex-col items-center flex-grow p-8">
        <Bookmark
          colors={colors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          bookmarks={bookmarks}
          goToBookmark={goToBookmark}
        />

        {/* Progress Header */}
        <div className="w-full max-w-4xl mx-auto mb-6 space-y-4">
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-white">{bookTitle}</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Book
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Progress: {pagesReadCounter}/{extractedPages.length} pages</span>
                <span>{progressPercentage}% Complete</span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-4 bg-gray-200/50 rounded-full">
                  <div
                    className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="absolute top-0 right-0">
                  <button
                    onClick={resetProgress}
                    className="text-xs text-white hover:text-gray-200 transition-colors"
                    title="Reset progress"
                  >
                    ⟳
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialTitle={bookTitle}
          initialCover={bookCoverPage}
          initialEndCover={bookEndCoverPage}
          onSave={handleSaveMetadataFromBook}
        />

        <HTMLFlipBook
          width={500}
          height={600}
          showCover={true}
          disableFlipByClick={true}
          useMouseEvents={true}
          useTouchEvents={true}
          onFlip={handlePageChange}
          ref={pageFlipRef}
        >
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            {bookCoverPage ? (
              <img
                src={bookCoverPage}
                alt="Book cover"
                className="w-full h-full object-cover"
                onError={(e) => e.target.parentElement.style.background = '#f3f4f6'}
              />
            ) : (
              <div className="text-gray-500">Loading cover...</div>
            )}
          </div>

          {extractedPages.flatMap((page, index) => [
            <div key={`left-${index}`} className="left-page page bg-white">
              {createPageLines("left", index)}
              <div className="page-content">
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
                <div className="px-6 pb-6">
                  <p className="text-gray-700 text-justify text-sm leading-relaxed">
                    {page.text}
                  </p>
                </div>
              </div>
            </div>,
            <div key={`right-${index}`} className="right-page page bg-white">
              {createPageLines("right", index)}
              <div className="page-content">
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
                <div className="px-6 pb-6">
                  <p className="text-gray-700 text-justify text-sm leading-relaxed">
                    {summaries[page.pageNumber] || (
                      <span className="text-gray-400">Generating summary...</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ])}

          <div className="w-full h-full flex flex-col items-center justify-center text-center rounded-lg overflow-hidden relative">
            {bookEndCoverPage ? (
              <img
                src={bookEndCoverPage}
                alt="Back cover"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => e.target.parentElement.style.background = '#f3f4f6'}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100" />
            )}
          </div>
        </HTMLFlipBook>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={goPrevious}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            ←
          </button>

          <div className="text-white font-medium min-w-[120px] text-center">
            {currentPage > 0 ? `Page ${currentPage}` : "Cover Page"}
          </div>

          <button
            onClick={goNext}
            disabled={currentPage === (2 + extractedPages.length * 2) - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <Chatbot currentPageText={currentVisiblePageText} />
    </div>
  );
};

export default Book;