// Book.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import Header from "./Header";
import AudioControl from "./AudioControl";
import EditModal from "./EditModal";
import Chatbot from "../ChatBot/Chatbot";
import BookControls from "./BookControls";
import DictionaryWidget from "./DictionaryWidget";  

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const Book = ({ extractedPages, pageFlipRef, currentPage, summaries, handleAudio, playingType, audioStatus, loadingType, bookmarks, isCurrentPageBookmarked, toggleBookmark, selectedColor, setSelectedColor, colors, goToBookmark, handleFlip, bookId, bookTitle, bookCoverPage, bookEndCoverPage, handleSaveMetadataFromBook, selectedVoice, handleVoiceChange,
}) => {
  const flipSoundRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVisiblePageText, setCurrentVisiblePageText] = useState("");
  const [pagesReadCounter, setPagesReadCounter] = useState(0);
  const [readPages, setReadPages] = useState(new Set());
  const [dynamicPages, setDynamicPages] = useState([]);
  const [fontSize, setFontSize] = useState("medium");
  const [customFontSize, setCustomFontSize] = useState(14);
  const [pendingCustomFontSize, setPendingCustomFontSize] = useState(14);
  const [lastFlippedPage, setLastFlippedPage] = useState(0);
  const [isPageRestored, setIsPageRestored] = useState(false); // Flag to track restoration
  const [goToPageNumber, setGoToPageNumber] = useState("");
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState("");
  const [translatedDynamicPages, setTranslatedDynamicPages] = useState([]);
  const [translatedSummaries, setTranslatedSummaries] = useState({});
  const translationLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    // Add more languages as needed
  ];

  // Reading speed logic (remains the same)
  const [pageStartTime, setPageStartTime] = useState(null);
  const [wordsOnCurrentPage, setWordsOnCurrentPage] = useState(0);
  const [totalWordsRead, setTotalWordsRead] = useState(0);
  const [totalTimeSpentReading, setTotalTimeSpentReading] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false); // State to control dictionary visibility

  const totalDynamicPages = dynamicPages.length;
  const progressPercentage =
    totalDynamicPages > 0
      ? Math.round((pagesReadCounter / totalDynamicPages) * 100)
      : 0;

  const getFontSizeStyle = () => {
    switch (fontSize) {
      case "small": return { fontSize: "12px" };
      case "medium": return { fontSize: "14px" };
      case "large": return { fontSize: "16px" };
      case "extra-large": return { fontSize: "18px" };
      case "custom": return { fontSize: `${customFontSize}px` };
      default: return { fontSize: "14px" };
    }
  };

  const splitTextIntoPages = (text, maxHeight, originalPageNumber) => {
    const words = text.split(" ");
    let currentText = "";
    const pages = [];
    let isFirstPart = true;

    const measureElement = document.createElement("div");
    measureElement.style.width = "460px";
    measureElement.style.padding = "0 20px";
    measureElement.style.fontSize = getFontSizeStyle().fontSize;
    measureElement.style.lineHeight = "1.5";
    measureElement.style.position = "absolute";
    measureElement.style.visibility = "hidden";
    document.body.appendChild(measureElement);

    words.forEach((word) => {
      const tempText = currentText + word + " ";
      measureElement.innerText = tempText;
      const height = measureElement.offsetHeight;

      if (height > maxHeight) {
        pages.push({
          text: currentText.trim(),
          displayPageNumber: isFirstPart
            ? `Page ${originalPageNumber}`
            : `Page ${originalPageNumber} (cont.)`,
          originalPageNumber,
        });
        currentText = word + " ";
        isFirstPart = false;
      } else {
        currentText = tempText;
      }
    });

    document.body.removeChild(measureElement);

    if (currentText) {
      pages.push({
        text: currentText.trim(),
        displayPageNumber: isFirstPart
          ? `Page ${originalPageNumber}`
          : `Page ${originalPageNumber} (cont.)`,
        originalPageNumber,
      });
    }

    return pages;
  };

  const debouncedSetCustomFontSize = useCallback(
    debounce((value) => {
      setCustomFontSize(value);
      setFontSize("custom");
    }, 500),
    []
  );

  useEffect(() => {
    const maxTextHeight = 500;
    const newDynamicPages = extractedPages.flatMap((page) =>
      splitTextIntoPages(page.text, maxTextHeight, page.pageNumber)
    );
    setDynamicPages(newDynamicPages);
    setIsPageRestored(false); // Reset restoration flag when pages change
  }, [extractedPages, fontSize, customFontSize]);

  // Function to fetch translated text from your backend
  const fetchTranslatedText = useCallback(async (text, targetLanguage) => {
    if (!text || !targetLanguage || targetLanguage === "en") {
      return text; // No need to translate if no text or target is English (original)
    }
    try {
      const response = await fetch("https://booksummary.onrender.com/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, targetLanguage }),
      });
      if (!response.ok) {
        console.error("Translation API error:", response.status);
        return text; // Return original text on error
      }
      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error("Error fetching translation:", error);
      return text; // Return original text on error
    }
  }, []);

  // Translate dynamic pages when language changes
  useEffect(() => {
    const translateAllPages = async () => {
      if (selectedTranslationLanguage && selectedTranslationLanguage !== "en") {
        const translatedPages = await Promise.all(
          dynamicPages.map(async (page) => ({
            ...page,
            text: await fetchTranslatedText(page.text, selectedTranslationLanguage),
          }))
        );
        setTranslatedDynamicPages(translatedPages);
      } else {
        setTranslatedDynamicPages([]); // Clear translated pages if English is selected
      }
    };

    translateAllPages();
  }, [dynamicPages, selectedTranslationLanguage, fetchTranslatedText]);

  // Translate summaries when language changes
  useEffect(() => {
    const translateAllSummaries = async () => {
      if (selectedTranslationLanguage && selectedTranslationLanguage !== "en" && summaries) {
        const translated = {};
        for (const pageNumber in summaries) {
          if (summaries.hasOwnProperty(pageNumber)) {
            translated[pageNumber] = await fetchTranslatedText(summaries[pageNumber], selectedTranslationLanguage);
          }
        }
        setTranslatedSummaries(translated);
      } else {
        setTranslatedSummaries({}); // Clear translated summaries if English is selected
      }
    };

    translateAllSummaries();
  }, [summaries, selectedTranslationLanguage, fetchTranslatedText]);

  // Determine which pages to display: original or translated
  const pagesToDisplay = selectedTranslationLanguage && selectedTranslationLanguage !== "en"
    ? translatedDynamicPages
    : dynamicPages;

  const summariesToDisplay = selectedTranslationLanguage && selectedTranslationLanguage !== "en"
    ? translatedSummaries
    : summaries;

  // Restore page after DOM is updated (adjust for translated pages)
  useEffect(() => {
    if (
      pageFlipRef.current &&
      pagesToDisplay.length > 0 &&
      lastFlippedPage > 0 &&
      !isPageRestored
    ) {
      const timer = setTimeout(() => {
        try {
          const targetFlipPage = lastFlippedPage; // Use the stored last flipped page number
          if (pageFlipRef.current.pageFlip() && typeof pageFlipRef.current.pageFlip().turnToPage === 'function') {
            pageFlipRef.current.pageFlip().turnToPage(targetFlipPage);
            setIsPageRestored(true); // Mark as restored
          } else {
            console.error("pageFlipRef or its methods are not available.");
          }
        } catch (error) {
          console.error("Failed to restore page:", error);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pagesToDisplay, lastFlippedPage, isPageRestored, pageFlipRef]); // Added pageFlipRef to dependencies

  useEffect(() => {
    flipSoundRef.current = new Audio("/sound/sound.mp3");
    if (pagesToDisplay.length > 0) {
      setCurrentVisiblePageText(pagesToDisplay[0].text);
    }
  }, [pagesToDisplay]);

  useEffect(() => {
    const storedPagesRead = localStorage.getItem(`book-${bookId}-pagesRead`);
    const storedReadPages = localStorage.getItem(`book-${bookId}-readPages`);
    const storedFontSize = localStorage.getItem(`book-${bookId}-fontSize`);
    const storedCustomFontSize = localStorage.getItem(`book-${bookId}-customFontSize`);
    const storedTranslationLanguage = localStorage.getItem(`book-${bookId}-translationLanguage`);
    const storedLastFlippedPage = localStorage.getItem(`book-${bookId}-lastFlippedPage`);

    if (storedPagesRead) setPagesReadCounter(parseInt(storedPagesRead, 10));
    if (storedReadPages) setReadPages(new Set(JSON.parse(storedReadPages)));
    if (storedFontSize) setFontSize(storedFontSize);
    if (storedCustomFontSize) setCustomFontSize(parseInt(storedCustomFontSize, 10));
    if (storedTranslationLanguage) setSelectedTranslationLanguage(storedTranslationLanguage);
    if (storedLastFlippedPage) setLastFlippedPage(parseInt(storedLastFlippedPage, 10));
  }, [bookId]);

  useEffect(() => {
    localStorage.setItem(`book-${bookId}-pagesRead`, pagesReadCounter);
    localStorage.setItem(`book-${bookId}-readPages`, JSON.stringify(Array.from(readPages)));
    localStorage.setItem(`book-${bookId}-fontSize`, fontSize);
    if (fontSize === "custom") {
      localStorage.setItem(`book-${bookId}-customFontSize`, customFontSize.toString());
    } else {
      localStorage.removeItem(`book-${bookId}-customFontSize`);
    }
    localStorage.setItem(`book-${bookId}-translationLanguage`, selectedTranslationLanguage);
    localStorage.setItem(`book-${bookId}-lastFlippedPage`, lastFlippedPage.toString());
  }, [pagesReadCounter, readPages, bookId, fontSize, customFontSize, selectedTranslationLanguage, lastFlippedPage]);

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

  useEffect(() => {
    if (currentVisiblePageText) {
      setWordsOnCurrentPage(currentVisiblePageText.split(/\s+/).filter(Boolean).length);
      setPageStartTime(Date.now());
    }
  }, [currentVisiblePageText]);

  const handlePageChange = (e) => {
    handleFlip(e);
    const currentPageNumber = e.data;
    setLastFlippedPage(currentPageNumber);
    setIsPageRestored(true); // Mark as restored when user flips manually

    if (pageStartTime && wordsOnCurrentPage > 0) {
      const timeSpentOnPage = Date.now() - pageStartTime;
      setTotalTimeSpentReading((prev) => prev + timeSpentOnPage);
      setTotalWordsRead((prev) => prev + wordsOnCurrentPage);

      const totalMinutes = totalTimeSpentReading / (1000 * 60);
      const wordsPerMinute = totalMinutes > 0 ? Math.round(totalWordsRead / totalMinutes) : 0;
      setReadingSpeed(wordsPerMinute);
    }

    if (currentPageNumber % 2 === 1) {
      const contentPageIndex = Math.floor((currentPageNumber - 1) / 2);
      if (contentPageIndex >= 0 && contentPageIndex < pagesToDisplay.length) {
        const page = pagesToDisplay[contentPageIndex];
        setCurrentVisiblePageText(page.text);

        if (!readPages.has(page.displayPageNumber)) {
          setPagesReadCounter((prev) => prev + 1);
          setReadPages((prev) => new Set([...prev, page.displayPageNumber]));
        }
      }
    }
    setPageStartTime(Date.now()); // Reset start time for the new page
  };

  const resetProgress = () => {
    setPagesReadCounter(0);
    setReadPages(new Set());
    setTotalWordsRead(0);
    setTotalTimeSpentReading(0);
    setReadingSpeed(0);
  };

  const createPageLines = (side, index) => {
    return Array.from({ length: Math.min(index + 1, 5) }).map((_, i) => (
      <div
        key={`${side}-line-${i}`}
        className={`page-line ${side}-line`}
        style={{ [side]: `${(i + 1) * 3}px`, opacity: 1 - i * 0.2, zIndex: -i }}
      />
    ));
  };

  const handleGoToPageInputChange = (event) => {
    setGoToPageNumber(event.target.value);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPageNumber, 10);
    if (!isNaN(pageNumber) && pageNumber > 0) {
      const targetDynamicPageIndex = extractedPages.findIndex(
        (page) => page.pageNumber === pageNumber
      );

      if (targetDynamicPageIndex !== -1) {
        const firstDynamicPageOfOriginal = pagesToDisplay.findIndex(
          (p) => p.originalPageNumber === pageNumber
        );

        if (firstDynamicPageOfOriginal !== -1) {
          const targetFlipPage = firstDynamicPageOfOriginal * 2 + 1 + 1;
          if (pageFlipRef.current && pageFlipRef.current.pageFlip() && typeof pageFlipRef.current.pageFlip().turnToPage === 'function') {
            pageFlipRef.current.pageFlip().turnToPage(targetFlipPage);
          } else {
            console.error("pageFlipRef or its methods are not available.");
            alert("Navigation failed. Please try again.");
          }
        } else {
          alert(`Page ${pageNumber} content not found after splitting.`);
        }
      } else {
        alert(`Page ${pageNumber} not found in the original book.`);
      }
    } else {
      alert("Please enter a valid page number.");
    }
    setGoToPageNumber(""); // Clear the input after navigating
  };

  const handleTranslationLanguageChange = (languageCode) => {
    setSelectedTranslationLanguage(languageCode);
  };

  const toggleDictionary = () => {
    setIsDictionaryOpen(!isDictionaryOpen);
  };

  if (!pagesToDisplay) return null;

  return (
    <div className="flex min-h-screen bg-[url(https://unblast.com/wp-content/uploads/2020/05/Light-Wood-Background-Texture.jpg)] p-4 relative">
 
    <div className="fixed bottom-4 left-4 z-[9999]">
      <button
        onClick={toggleDictionary}
        className="bg-black text-white font-bold py-2 px-4 rounded-[50%] shadow-md cursor-pointer"
        title="Toggle Dictionary"
      >
        <span style={{ fontSize: '1.5em' }}>
          <i className="fa-solid fa-book"></i>
        </span>
      </button>

      {isDictionaryOpen && (
        <div
          className="absolute bottom-[calc(100%+0.75rem)] left-0 w-[400px] shadow-lg rounded-lg bg-white overflow-hidden z-[9999]"
        >
          <DictionaryWidget />
        </div>
      )}
    </div>

      <div className="flex flex-col items-center flex-grow p-3">
        <Header
          colors={colors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          bookmarks={bookmarks}
          goToBookmark={goToBookmark}
          bookTitle={bookTitle}
          onEditButtonClick={() => setIsModalOpen(true)}
          selectedVoice={selectedVoice}
          handleVoiceChange={handleVoiceChange}
          fontSize={fontSize}
          setFontSize={setFontSize}
          customFontSize={customFontSize}
          setCustomFontSize={debouncedSetCustomFontSize}
          pendingCustomFontSize={pendingCustomFontSize}
          setPendingCustomFontSize={setPendingCustomFontSize}
          goToPageNumber={goToPageNumber}
          handleGoToPageInputChange={handleGoToPageInputChange}
          handleGoToPage={handleGoToPage}
          totalDynamicPages={dynamicPages.length} // Use original dynamicPages length
          extractedPages={extractedPages} // Pass extractedPages as a prop
          readingSpeed={readingSpeed} // Pass reading speed to header
          // Pass translation related props
          selectedTranslationLanguage={selectedTranslationLanguage}
          handleTranslationLanguageChange={handleTranslationLanguageChange}
          translationLanguages={translationLanguages}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialTitle={bookTitle}
          initialCover={bookCoverPage}
          initialEndCover={bookEndCoverPage}
          onSave={handleSaveMetadataFromBook}
        />

        <HTMLFlipBook
          key={`flipbook-${pagesToDisplay.length}-${fontSize}-${customFontSize}`}
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
                onError={(e) => (e.target.parentElement.style.background = "#f3f4f6")}
              />
            ) : (
              <div className="text-gray-500">Loading cover...</div>
            )}
          </div>

          {pagesToDisplay.flatMap((page, index) => [
            <div key={`left-${index}`} className="left-page page bg-white">
              {createPageLines("left", index)}
              <div className="page-content flex flex-col h-full">
                <div className="flex justify-between items-start p-6 pb-4">
                  <span className="text-gray-500 font-medium">{page.displayPageNumber}</span>
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
                <div className="flex-1 px-6 pb-6 overflow-y-auto">
                  <p
                    className="text-gray-700 text-justify text-sm leading-relaxed"
                    style={getFontSizeStyle()}
                  >
                    {page.text}
                  </p>
                </div>
              </div>
            </div>,
            <div key={`right-${index}`} className="right-page page bg-white">
              {createPageLines("right", index)}
              <div className="page-content flex flex-col h-full">
                <div className="flex justify-between items-start p-6 pb-4">
                  <span className="text-blue-500 font-medium">
                    AI Summary - Page {page.originalPageNumber}
                  </span>
                  <AudioControl
                    text={summariesToDisplay[page.originalPageNumber]}
                    type="summary"
                    handleAudio={handleAudio}
                    playingType={playingType}
                    audioStatus={audioStatus}
                    loadingType={loadingType}
                  />
                </div>
                <div className="flex-1 px-6 pb-6 overflow-y-auto">
                  <p
                    className="text-gray-700 text-justify text-sm leading-relaxed"
                    style={getFontSizeStyle()}
                  >
                    {summariesToDisplay[page.originalPageNumber] || (
                      <span className="text-gray-400">Generating summary...</span>
                    )}
                  </p>
                </div>
              </div>
            </div>,
          ])}

          <div className="w-full h-full flex flex-col items-center justify-center text-center rounded-lg overflow-hidden relative">
            {bookEndCoverPage ? (
              <img
                src={bookEndCoverPage}
                alt="Back cover"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => (e.target.parentElement.style.background = "#f3f4f6")}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100" />
            )}
          </div>

        </HTMLFlipBook>

        <BookControls
          goPrevious={goPrevious}
          goNext={goNext}
          currentPage={currentPage}
          totalDynamicPages={dynamicPages.length} // Use original length for controls
          progressPercentage={progressPercentage}
          pagesReadCounter={pagesReadCounter}
          resetProgress={resetProgress}
        />
      </div>

      {/* Chatbot remains on the right */}
      <Chatbot currentPageText={currentVisiblePageText} selectedTranslationLanguage={selectedTranslationLanguage} fetchTranslatedText={fetchTranslatedText} />
    </div>
  );
};

export default Book;