import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Book from "@/components/Book";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [extractedPages, setExtractedPages] = useState(
    location.state?.extractedPages || null
  );

  // -- All "Book" states --
  const [summaries, setSummaries] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  // -- Audio states --
  const [playingType, setPlayingType] = useState(null); // e.g. "book", "summary", or null
  const [audioStatus, setAudioStatus] = useState("stopped"); // "playing", "paused", "stopped"
  const [loadingType, setLoadingType] = useState(null);
  const audioRef = useRef(new Audio());

  // -- Bookmarks --
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
    "#FFEEAD", "#D4A5A5", "#79B9C6", "#A2E1DB", 
    "#E3A3CA", "#F0E14A",
  ];

  // -- PageFlip Ref --
  const pageFlipRef = useRef(null);

  // -- Check if current page is bookmarked --
  const isCurrentPageBookmarked = () =>
    bookmarks.some((b) => b.pageNumber === currentPage);

  // -- Add/Remove bookmark --
  const toggleBookmark = () => {
    if (!extractedPages || !extractedPages[currentPage - 1]) return;
    const currentPageData = extractedPages[currentPage - 1];

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

  // -- Summaries logic --
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
        setSummaries((prev) => ({ ...prev, [pageNumber]: data.summary }));
      }
    } catch (error) {
      console.error(`Error fetching summary: ${error}`);
    }
  };

  // -- Pre-fetch summary for first page, if available --
  useEffect(() => {
    if (extractedPages && extractedPages[0]?.text) {
      fetchSummary(extractedPages[0].text, extractedPages[0].pageNumber);
    }
  }, [extractedPages]);

  // -- Flip event from FlipBook --
  const handleFlip = (flipData) => {
    const physicalPage = flipData.data;
    let logicalPage = 0;
    if (physicalPage > 0) {
      logicalPage = Math.ceil(physicalPage / 2);
    }

    // Stop audio when flipping pages
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlayingType(null);
    setAudioStatus("stopped");
    setLoadingType(null);

    setCurrentPage(logicalPage);

    // Pre-fetch adjacent pages
    [logicalPage, logicalPage + 1].forEach((p) => {
      const pageData = extractedPages?.[p - 1];
      if (pageData?.text && !summaries[p]) {
        fetchSummary(pageData.text, p);
      }
    });
  };

  // -- Handle Play/Pause logic for Book/Summary audio --
  const handleAudio = async (text, type) => {
    if (!text) return;

    // If we're already dealing with the same type (e.g. "book" or "summary")
    if (playingType === type) {
      // 1) If currently playing => pause
      if (audioStatus === "playing") {
        audioRef.current.pause();
        setAudioStatus("paused");
      }
      // 2) If currently paused => resume
      else if (audioStatus === "paused") {
        audioRef.current.play();
        setAudioStatus("playing");
      }
      // 3) If "stopped" => treat like new playback (rare case)
      else {
        await fetchAndPlayAudio(text, type);
      }
    } else {
      // Different type or not playing any audio => stop old audio and fetch new
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioStatus("stopped");

      setPlayingType(type);
      await fetchAndPlayAudio(text, type);
    }
  };

  // -- Helper: fetch TTS audio from API, then play it --
  const fetchAndPlayAudio = async (text, type) => {
    try {
      setLoadingType(type);
      const response = await fetch("http://localhost:3000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.success) {
        audioRef.current.src = `data:audio/mp3;base64,${data.audioContent}`;
        audioRef.current.play();
        setAudioStatus("playing");

        // When audio ends, reset
        audioRef.current.onended = () => {
          setAudioStatus("stopped");
          setPlayingType(null);
        };
      }
    } catch (error) {
      console.error("TTS Error:", error);
    } finally {
      setLoadingType(null);
    }
  };

  // -- Jump to bookmark page --
  const goToBookmark = (pageNumber) => {
    const physicalPage = pageNumber * 2 - 1;
    pageFlipRef.current?.pageFlip().flip(physicalPage);
  };

  // Redirect to landing if no extracted pages
  useEffect(() => {
    if (!extractedPages) {
      navigate('/landingpage');
    }
  }, [extractedPages, navigate]);

  return (
    <div className="min-h-screen bg-gray-950">
      {extractedPages && (
        <div className="w-full overflow-x-hidden">
          <Book
            extractedPages={extractedPages}
            pageFlipRef={pageFlipRef}
            currentPage={currentPage}
            summaries={summaries}
            handleAudio={handleAudio}
            playingType={playingType}
            audioStatus={audioStatus}
            loadingType={loadingType}
            bookmarks={bookmarks}
            isCurrentPageBookmarked={isCurrentPageBookmarked}
            toggleBookmark={toggleBookmark}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colors={colors}
            goToBookmark={goToBookmark}
            handleFlip={handleFlip}
          />
        </div>
      )}
    </div>
  );
};

export default Home;