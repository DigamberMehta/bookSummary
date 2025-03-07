import React, { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const Book = ({ extractedPages }) => {
  const pageFlipRef = useRef(null);
  const [summaries, setSummaries] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // Track the current flipped page

  // Function to fetch AI summary for a given text (Only if not already fetched)
  const fetchSummary = async (text, pageNumber) => {
    if (summaries[pageNumber]) return; // Prevent duplicate requests
    console.log(`📢 Requesting AI Summary for Page ${pageNumber}...`);

    try {
      const response = await fetch("http://localhost:3000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(`✅ Summary received for Page ${pageNumber}:`, data.summary.substring(0, 50), "...");
        setSummaries((prevSummaries) => ({
          ...prevSummaries,
          [pageNumber]: data.summary,
        }));
      }
    } catch (error) {
      console.error(`❌ Error fetching summary for Page ${pageNumber}:`, error);
    }
  };

  // Fetch Page 1 summary immediately when text is extracted
  useEffect(() => {
    if (extractedPages.length > 0) {
      console.log("🚀 Initializing book, fetching summary for Page 1...");
      fetchSummary(extractedPages[0].text, extractedPages[0].pageNumber);
    }
  }, [extractedPages]);

  // Handler for page flip event (Adjust page number calculation)
  const handleFlip = (e) => {
    const flippedPhysicalPage = e.data; // The actual page index in the flipbook

    // Convert physical index to logical page number
    const logicalPageNumber = Math.floor(flippedPhysicalPage / 2) + 1;
    setCurrentPage(logicalPageNumber);

    console.log(`📖 Flipped to Logical Page ${logicalPageNumber}`);

    // Fetch summary for the flipped page
    if (extractedPages[logicalPageNumber - 1]) {
      fetchSummary(extractedPages[logicalPageNumber - 1].text, extractedPages[logicalPageNumber - 1].pageNumber);
    }

    // Preload next page summary (if exists)
    if (extractedPages[logicalPageNumber]) {
      fetchSummary(extractedPages[logicalPageNumber].text, extractedPages[logicalPageNumber].pageNumber);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950 p-8 relative">
      <HTMLFlipBook
        ref={pageFlipRef}
        width={550}
        height={700}
        size="fixed"
        showCover={true}
        maxShadowOpacity={0.5}
        style={{ gap: "0px" }}
        onFlip={handleFlip} // Listen for page flip
      >
        {/* Cover Page */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center text-center rounded-lg">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg p-4">
            AI Book Summary
          </h1>
          <p className="text-xl text-gray-200 mt-4">
            Your Smart Book Summarizer
          </p>
        </div>

        {/* Content Pages (Left: Original Text, Right: AI Summary) */}
        {extractedPages.flatMap((page, index) => [
          // Left Page (Original Text) - Show Page Number
          <div
            key={`left-${index}`}
            className="w-full h-full bg-white rounded-lg shadow-lg flex flex-col justify-between p-10"
          >
            <div className="flex justify-between mb-6">
              <span className="text-gray-500 font-medium">
                Page {page.pageNumber}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify text-sm font-serif">
              {page.text}
            </p>
          </div>,

          // Right Page (AI Summary) - No Page Number
          <div
            key={`right-${index}`}
            className="w-full h-full bg-gray-100 rounded-lg shadow-lg flex flex-col justify-between p-10"
          >
            <div className="flex justify-between mb-6">
              <span className="text-blue-600 font-medium">Summary</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify text-lg font-serif">
              {summaries[page.pageNumber] || "Loading summary..."}
            </p>
          </div>,
        ])}
      </HTMLFlipBook>
    </div>
  );
};

export default Book;
