import React, { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const Book = ({ extractedPages }) => {
  const pageFlipRef = useRef(null);
  const [summaries, setSummaries] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [playingType, setPlayingType] = useState(null);
  const [loadingType, setLoadingType] = useState(null);
  const audioRef = useRef(new Audio());
  
  // Bookmark states
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
    "#D4A5A5", "#79B9C6", "#A2E1DB", "#E3A3CA", "#F0E14A"
  ];

  const isCurrentPageBookmarked = () => {
    return bookmarks.some(b => b.pageNumber === currentPage);
  };

  const toggleBookmark = () => {
    const currentPageData = extractedPages[currentPage - 1];
    if (!currentPageData) return;

    setBookmarks(prev => isCurrentPageBookmarked() ?
      prev.filter(b => b.pageNumber !== currentPage) :
      [...prev, {
        pageNumber: currentPage,
        color: selectedColor,
        textSnippet: currentPageData.text.substring(0, 50) + "..."
      }]
    );
  };

  const fetchSummary = async (text, pageNumber) => {
    if (!text || summaries[pageNumber]) return;
    
    try {
      const response = await fetch("http://localhost:3000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      data.success && setSummaries(prev => ({
        ...prev,
        [pageNumber]: data.summary
      }));
    } catch (error) {
      console.error(`Error fetching summary: ${error}`);
    }
  };

  useEffect(() => {
    extractedPages[0]?.text && fetchSummary(extractedPages[0].text, extractedPages[0].pageNumber);
  }, [extractedPages]);

  const handleFlip = (e) => {
    const physicalPage = e.data;
    let logicalPage = 0;
    
    if (physicalPage > 0) {
      logicalPage = Math.ceil(physicalPage / 2);
    }

    audioRef.current.pause();
    setPlayingType(null);
    setLoadingType(null);
    setCurrentPage(logicalPage);

    // Pre-fetch adjacent page summaries
    [logicalPage, logicalPage + 1].forEach(p => {
      const pageData = extractedPages[p - 1];
      pageData?.text && !summaries[p] && fetchSummary(pageData.text, p);
    });
  };

  const readText = async (text, type) => {
    if (!text) return;

    if (playingType === type) {
      audioRef.current.pause();
      setPlayingType(null);
      return;
    }

    setLoadingType(type);
    
    try {
      const response = await fetch("http://localhost:3000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.success) {
        audioRef.current.src = `data:audio/mp3;base64,${data.audioContent}`;
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingType(null);
        setPlayingType(type);
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
    setLoadingType(null);
  };

  const goToBookmark = (pageNumber) => {
    const physicalPage = (pageNumber * 2) - 1;
    pageFlipRef.current?.pageFlip().flip(physicalPage);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-950 p-8">
      {/* Top Control Bar */}
      <div className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-lg mb-8 shadow-lg sticky top-4 z-50">
        <div className="flex flex-col gap-4">
          {/* Color Selection */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-600 font-medium">Bookmark Color:</span>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    selectedColor === color ? "border-black scale-110" : "border-transparent"
                  } hover:scale-105`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Bookmarks List */}
          {bookmarks.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {bookmarks.map((bookmark, index) => (
                  <button
                    key={index}
                    onClick={() => goToBookmark(bookmark.pageNumber)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
                    style={{ borderLeft: `6px solid ${bookmark.color}` }}
                  >
                    <span className="text-gray-700 font-medium">Page {bookmark.pageNumber}</span>
                    <span className="text-gray-400 text-sm truncate max-w-[160px]">
                      {bookmark.textSnippet}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flip Book Component */}
      <HTMLFlipBook
        ref={pageFlipRef}
        width={550}
        height={700}
        maxShadowOpacity={0.3}
        showCover={true}
        onFlip={handleFlip}
        className="shadow-xl"
      >
        {/* Cover Page */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center text-center rounded-lg overflow-hidden">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg px-4">
            AI Book Summary
          </h1>
          <p className="text-xl text-gray-200 px-4">Smart Reading Companion</p>
        </div>

        {/* Content Pages */}
        {extractedPages.flatMap((page, index) => [
          // Left Page (Original Text)
          <div 
            key={`left-${index}`} 
            className="w-full h-full bg-white flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 pb-4">
              <span className="text-gray-500 font-medium">Page {page.pageNumber}</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    readText(page.text, "book");
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    playingType === "book" ? "bg-red-500" : "bg-blue-500"
                  } text-white hover:opacity-90 flex items-center justify-center w-10`}
                >
                  {loadingType === "book" ? (
                    <i className="fa-regular fa-spinner fa-spin text-sm" style={{ pointerEvents: 'none' }} />
                  ) : playingType === "book" ? (
                    <i className="fa-solid fa-stop text-sm" style={{ pointerEvents: 'none' }} />
                  ) : (
                    <i className="fa-solid fa-play text-sm" style={{ pointerEvents: 'none' }} />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    isCurrentPageBookmarked() ? "bg-red-500" : "bg-green-500"
                  } text-white hover:opacity-90 flex items-center justify-center w-10`}
                >
                  {isCurrentPageBookmarked() ? (
                    <i className="fa-solid fa-bookmark-slash text-sm" style={{ pointerEvents: 'none' }} />
                  ) : (
                    <i className="fa-solid fa-bookmark text-sm" style={{ pointerEvents: 'none' }} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto px-6 pb-6">
              <p className="text-gray-700 leading-relaxed text-justify text-sm">
                {page.text}
              </p>
            </div>
          </div>,

          // Right Page (Summary)
          <div 
            key={`right-${index}`} 
            className="w-full h-full bg-gray-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 pb-4">
              <span className="text-blue-500 font-medium">AI Summary</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  readText(summaries[page.pageNumber], "summary");
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  playingType === "summary" ? "bg-red-500" : "bg-blue-500"
                } text-white hover:opacity-90 flex items-center justify-center w-10`}
              >
                {loadingType === "summary" ? (
                  <i className="fa-regular fa-spinner fa-spin text-sm" style={{ pointerEvents: 'none' }} />
                ) : playingType === "summary" ? (
                  <i className="fa-solid fa-stop text-sm" style={{ pointerEvents: 'none' }} />
                ) : (
                  <i className="fa-solid fa-play text-sm" style={{ pointerEvents: 'none' }} />
                )}
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6 pb-6">
              <p className="text-gray-700 leading-relaxed text-justify text-base">
                {summaries[page.pageNumber] || (
                  <span className="text-gray-400">Generating summary...</span>
                )}
              </p>
            </div>
          </div>
        ])}
      </HTMLFlipBook>
    </div>
  );
};

export default Book;