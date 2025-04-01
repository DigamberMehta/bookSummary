// components/BookControls.jsx
import React from "react";

const BookControls = ({
  goPrevious,
  goNext,
  currentPage,
  totalDynamicPages,
  progressPercentage,
  pagesReadCounter,
  resetProgress,
}) => {
  return (
    <div className="mt-6 space-y-4 w-full max-w-[500px]">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goPrevious}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-white/20 text-black border border-black rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
        >
          ← Previous
        </button>
        <div className="text-black font-medium text-sm">
          {currentPage > 0 ? `Page ${currentPage}` : "Cover Page"}
        </div>
        <button
          onClick={goNext}
          disabled={currentPage === 2 + totalDynamicPages * 2 - 1}
          className="px-4 py-2 bg-white/20 text-black border border-black rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
        >
          Next →
        </button>
      </div>

      <div className="bg-white/10 rounded-lg p-3 border border-black">
        <div className="flex items-center justify-between mb-2 text-sm text-black">
          <span>Progress: {progressPercentage}%</span>
          <div className="flex items-center gap-2">
            <span>
              {pagesReadCounter}/{totalDynamicPages} pages
            </span>
            <button
              onClick={resetProgress}
              className="text-xs p-1 hover:bg-black/10 rounded transition-colors"
              title="Reset progress"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>
        <div className="relative h-2 bg-black/20 rounded-full">
          <div
            className="absolute left-0 top-0 h-full bg-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookControls;