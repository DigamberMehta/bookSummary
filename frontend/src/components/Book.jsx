import React, { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

// Import your new components
import TopBar from "./TopBar";
import AudioControl from "./AudioControl";

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
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#79B9C6",
    "#A2E1DB",
    "#E3A3CA",
    "#F0E14A",
  ];

  const isCurrentPageBookmarked = () => {
    return bookmarks.some((b) => b.pageNumber === currentPage);
  };

  const toggleBookmark = () => {
    const currentPageData = extractedPages[currentPage - 1];
    if (!currentPageData) return;

    setBookmarks((prev) =>
      isCurrentPageBookmarked()
        ? prev.filter((b) => b.pageNumber !== currentPage)
        : [
            ...prev,
            {
              pageNumber: currentPage,
              color: selectedColor,
              textSnippet: currentPageData.text.substring(0, 50) + "...",
            },
          ]
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
      if (data.success) {
        setSummaries((prev) => ({
          ...prev,
          [pageNumber]: data.summary,
        }));
      }
    } catch (error) {
      console.error(`Error fetching summary: ${error}`);
    }
  };

  useEffect(() => {
    if (extractedPages[0]?.text) {
      fetchSummary(extractedPages[0].text, extractedPages[0].pageNumber);
    }
  }, [extractedPages]);

  const handleFlip = (e) => {
    const physicalPage = e.data;
    let logicalPage = 0;

    if (physicalPage > 0) {
      logicalPage = Math.ceil(physicalPage / 2);
    }

    // Stop audio when flipping
    audioRef.current.pause();
    setPlayingType(null);
    setLoadingType(null);
    setCurrentPage(logicalPage);

    // Prefetch adjacent page summaries
    [logicalPage, logicalPage + 1].forEach((p) => {
      const pageData = extractedPages[p - 1];
      if (pageData?.text && !summaries[p]) {
        fetchSummary(pageData.text, p);
      }
    });
  };

  // TTS logic
  const readText = async (text, type) => {
    if (!text) return;

    // If already playing this audio type, stop
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
    const physicalPage = pageNumber * 2 - 1;
    pageFlipRef.current?.pageFlip().flip(physicalPage);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-950 p-8">
      {/* -- Top Control Bar (Separated into its own component) -- */}
      <TopBar
        colors={colors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        bookmarks={bookmarks}
        goToBookmark={goToBookmark}
      />

      {/* -- FlipBook -- */}
      <HTMLFlipBook
        ref={pageFlipRef}
        width={550}
        height={700}
        maxShadowOpacity={0.3}
        showCover={true}
        onFlip={handleFlip}
        className="shadow-xl"
      >
        {/* -- Cover Page -- */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center text-center rounded-lg overflow-hidden">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg px-4">
            AI Book Summary
          </h1>
          <p className="text-xl text-gray-200 px-4">Smart Reading Companion</p>
        </div>

        {/* -- Content Pages -- */}
        {extractedPages.flatMap((page, index) => [
          // Left Page (Original Text)
          <div
            key={`left-${index}`}
            className="w-full h-full bg-white flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 pb-4">
              <span className="text-gray-500 font-medium">Page {page.pageNumber}</span>
              
              {/* -- Audio / Bookmark Controls (Separated into AudioControl) -- */}
              <AudioControl
                text={page.text}
                type="book"
                readText={readText}
                playingType={playingType}
                loadingType={loadingType}
                isBookmarked={isCurrentPageBookmarked()}
                toggleBookmark={toggleBookmark}
              />
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
              <AudioControl
                text={summaries[page.pageNumber]}
                type="summary"
                readText={readText}
                playingType={playingType}
                loadingType={loadingType}
              />
            </div>
            <div className="flex-1 overflow-auto px-6 pb-6">
              <p className="text-gray-700 leading-relaxed text-justify text-base">
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
