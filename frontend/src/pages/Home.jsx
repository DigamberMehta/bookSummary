import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Book from "@/components/Book/Book";
import axios from 'axios'; // Import axios if you haven't already

const Home = () => {
  const navigate = useNavigate();
  const { bookId } = useParams(); // Get bookId from URL

  // -- API Base URL --
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:3000"); // You can set a default here

  // -- Book states --
  const [book, setBook] = useState(null); // Store the entire book data
  const [summaries, setSummaries] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]); // Initialize from book data

  // -- Audio states --
  const [playingType, setPlayingType] = useState(null);
  const [audioStatus, setAudioStatus] = useState("stopped");
  const [loadingType, setLoadingType] = useState(null);
  const audioRef = useRef(new Audio());

  // -- Voice selection state --
  const [selectedVoice, setSelectedVoice] = useState({
    languageCode: "en-US",
    name: "en-US-Wavenet-J",
    ssmlGender: "MALE",
  });

  // -- Bookmark color state --
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

  // -- PageFlip Ref --
  const pageFlipRef = useRef(null);

  // -- Fetch book data on mount --
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/books/${bookId}` // Use the variable here
        );
        const data = await response.json();

        if (data.success) {
          setBook(data.book); // Store the entire book data
          setBookmarks(data.book.bookmarks || []); // Initialize bookmarks from book data

          // Initialize summaries from the book data
          const initialSummaries = {};
          data.book.pages.forEach((page) => {
            if (page.summary) {
              initialSummaries[page.pageNumber] = page.summary;
            }
          });
          setSummaries(initialSummaries);
        } else {
          navigate("/landingpage"); // Redirect if book not found
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        navigate("/landingpage"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
    else navigate("/landingpage"); // Redirect if no bookId
  }, [bookId, navigate, apiBaseUrl]); // Add apiBaseUrl to the dependency array

  // -- Save Metadata Handler --
  const handleSaveMetadata = async (metadata) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/books/${bookId}`, // Use the variable here
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: metadata.editedTitle,
            coverPage: metadata.editedCover,
            endCoverPage: metadata.editedEndCover,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setBook(data.book); // Update the book state with new metadata
      }
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  };

  // -- Bookmark logic --
  const isCurrentPageBookmarked = () =>
    bookmarks.some((b) => b.pageNumber === currentPage);

  const toggleBookmark = async () => {
    if (!book?.pages || !book.pages[currentPage - 1]) return;
    const currentPageData = book.pages[currentPage - 1];
    const pageNumber = currentPage;
    const color = selectedColor;
    const textSnippet = currentPageData.text.substring(0, 50) + "...";

    try {
      let updatedBookmarks;
      if (isCurrentPageBookmarked()) {
        // Remove bookmark
        const response = await axios.delete(
          `${apiBaseUrl}/api/books/${bookId}/bookmarks/${pageNumber}`, // Use the variable here
          { withCredentials: true }
        );
        if (response.data.success) {
          updatedBookmarks = response.data.bookmarks;
        }
      } else {
        // Add bookmark
        const response = await axios.post(
          `${apiBaseUrl}/api/books/${bookId}/bookmarks`, // Use the variable here
          { pageNumber, color, textSnippet },
          { withCredentials: true }
        );
        if (response.data.success) {
          updatedBookmarks = response.data.bookmarks;
        }
      }
      if (updatedBookmarks) {
        setBookmarks(updatedBookmarks);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // -- Summary logic with DB sync --
  const fetchSummary = async (text, pageNumber) => {
    if (!text || summaries[pageNumber] || !bookId) return;

    try {
      // Get summary from AI
      const summaryResponse = await fetch(
        `${apiBaseUrl}/api/summarize`, // Use the variable here
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );
      const summaryData = await summaryResponse.json();

      if (summaryData.success) {
        // Update local state
        setSummaries((prev) => ({
          ...prev,
          [pageNumber]: summaryData.summary,
        }));

        // Update database
        await fetch(
          `${apiBaseUrl}/api/books/${bookId}/page/${pageNumber}`, // Use the variable here
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summary: summaryData.summary }),
          }
        );
      }
    } catch (error) {
      console.error("Summary error:", error);
    }
  };

  // -- Pre-fetch first page summary --
  useEffect(() => {
    if (book?.pages?.[0]?.text && !summaries[1]) {
      fetchSummary(book.pages[0].text, 1);
    }
  }, [book, summaries, apiBaseUrl]); // Add apiBaseUrl to the dependency array

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
      const pageData = book?.pages?.[p - 1];
      if (pageData?.text && !summaries[p]) {
        fetchSummary(pageData.text, p);
      }
    });
  };

  // -- Handle voice change --
  const handleVoiceChange = (event) => {
    const [name, gender] = event.target.value.split(",");
    setSelectedVoice({
      languageCode: "en-US",
      name: `en-US-Wavenet-${name}`,
      ssmlGender: gender,
    });
  };

  // -- Audio handling --
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
      const ttsResponse = await fetch(`${apiBaseUrl}/api/tts`, { // Use the variable here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: selectedVoice }), // Include selectedVoice
      });
      const ttsData = await ttsResponse.json();

      if (ttsData.success) {
        // Play audio directly (no DB saving)
        audioRef.current.src = `data:audio/mp3;base64,${ttsData.audioContent}`;
        audioRef.current.play();
        setAudioStatus("playing");

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

  // -- Bookmark navigation --
  const goToBookmark = (pageNumber) => {
    const physicalPage = pageNumber * 2 - 1;
    pageFlipRef.current?.pageFlip().flip(physicalPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        Book not found
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Book Component */}
      {book.pages && (
        <div className="w-full overflow-x-hidden">
          <Book
            extractedPages={book.pages}
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
            bookId={bookId}
            bookTitle={book.title}
            bookCoverPage={book.coverPage}
            bookEndCoverPage={book.endCoverPage}
            handleSaveMetadataFromBook={handleSaveMetadata}
            selectedVoice={selectedVoice}
            handleVoiceChange={handleVoiceChange}
            apiBaseUrl={apiBaseUrl} // Pass the variable as a prop
          />
        </div>
      )}
    </div>
  );
};

export default Home;