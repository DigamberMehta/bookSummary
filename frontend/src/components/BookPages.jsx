import React from "react";
import TextPage from "./TextPage";
import SummaryPage from "./SummaryPage";

const BookPages = ({
  extractedPages,
  summaries,
  readText,
  playingType,
  loadingType,
  toggleBookmark,
  isCurrentPageBookmarked,
}) => {
  return (
    <>
      {extractedPages.flatMap((page, index) => [
        // Left (Text) Page
        <TextPage
          key={`text-${index}`}
          page={page}
          readText={readText}
          playingType={playingType}
          loadingType={loadingType}
          toggleBookmark={toggleBookmark}
          isBookmarked={isCurrentPageBookmarked()}
        />,
        // Right (Summary) Page
        <SummaryPage
          key={`summary-${index}`}
          page={page}
          summaries={summaries}
          readText={readText}
          playingType={playingType}
          loadingType={loadingType}
        />,
      ])}
    </>
  );
};

export default BookPages;
