import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Book from "@/components/Book";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [extractedPages, setExtractedPages] = useState(
    location.state?.extractedPages || null
  );
  const [bookId, setBookId] = useState(null);

  // -- Book states --
  const [summaries, setSummaries] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  // -- Audio states --
  const [playingType, setPlayingType] = useState(null);
  const [audioStatus, setAudioStatus] = useState("stopped");
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

  // -- Save initial book data --
  useEffect(() => {
    const saveInitialBook = async () => {
      if (extractedPages && !bookId) {
        try {
          const response = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pages: extractedPages.map(page => ({
                pageNumber: page.pageNumber,
                text: page.text
              }))
            })
          });
          const data = await response.json();
          if (data.success) setBookId(data.bookId);
        } catch (error) {
          console.error('Error saving book:', error);
        }
      }
    };
    
    saveInitialBook();
  }, [extractedPages, bookId]);

  // -- Bookmark logic --
  const isCurrentPageBookmarked = () =>
    bookmarks.some((b) => b.pageNumber === currentPage);

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

  // -- Summary logic with DB sync --
  const fetchSummary = async (text, pageNumber) => {
    if (!text || summaries[pageNumber] || !bookId) return;
    
    try {
      // Get summary from AI
      const summaryResponse = await fetch('http://localhost:3000/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const summaryData = await summaryResponse.json();
      
      if (summaryData.success) {
        // Update local state
        setSummaries(prev => ({ ...prev, [pageNumber]: summaryData.summary }));
        
        // Update database
        await fetch(`http://localhost:3000/api/books/${bookId}/page/${pageNumber}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ summary: summaryData.summary })
        });
      }
    } catch (error) {
      console.error('Summary error:', error);
    }
  };

  // -- Pre-fetch first page summary --
  useEffect(() => {
    if (extractedPages?.[0]?.text) {
      fetchSummary(extractedPages[0].text, extractedPages[0].pageNumber);
    }
  }, [extractedPages]);

  // -- Flip handler --
  const handleFlip = (flipData) => {
    const physicalPage = flipData.data;
    let logicalPage = physicalPage > 0 ? Math.ceil(physicalPage / 2) : 0;

    // Stop audio
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

  // -- Audio handling (no DB sync) --
  const handleAudio = async (text, type) => {
    if (!text) return;

    if (playingType === type) {
      if (audioStatus === "playing") {
        audioRef.current.pause();
        setAudioStatus("paused");
      } else if (audioStatus === "paused") {
        audioRef.current.play();
        setAudioStatus("playing");
      } else {
        await fetchAndPlayAudio(text, type);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioStatus("stopped");
      setPlayingType(type);
      await fetchAndPlayAudio(text, type);
    }
  };

  const fetchAndPlayAudio = async (text, type) => {
    try {
      setLoadingType(type);
      const ttsResponse = await fetch('http://localhost:3000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const ttsData = await ttsResponse.json();
      
      if (ttsData.success) {
        // Play audio directly (no DB saving)
        audioRef.current.src = `data:audio/mp3;base64,${ttsData.audioContent}`;
        audioRef.current.play();
        setAudioStatus('playing');

        audioRef.current.onended = () => {
          setAudioStatus("stopped");
          setPlayingType(null);
        };
      }
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setLoadingType(null);
    }
  };

  // -- Bookmark navigation --
  const goToBookmark = (pageNumber) => {
    const physicalPage = pageNumber * 2 - 1;
    pageFlipRef.current?.pageFlip().flip(physicalPage);
  };

  // -- Redirect if no pages --
  useEffect(() => {
    if (!extractedPages) navigate('/landingpage');
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