import React from "react";

const AudioControl = ({
  text,
  type,
  readText,
  playingType,
  loadingType,
  isBookmarked,
  toggleBookmark,
}) => {
  return (
    <div className="flex gap-2">
      {/* Play/Stop Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          readText(text, type);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`px-3 py-1 rounded-lg transition-colors ${
          playingType === type ? "bg-red-500" : "bg-blue-500"
        } text-white hover:opacity-90 flex items-center justify-center w-10`}
      >
        {loadingType === type ? (
          <i className="fa-regular fa-spinner fa-spin text-sm" style={{ pointerEvents: "none" }} />
        ) : playingType === type ? (
          <i className="fa-solid fa-stop text-sm" style={{ pointerEvents: "none" }} />
        ) : (
          <i className="fa-solid fa-play text-sm" style={{ pointerEvents: "none" }} />
        )}
      </button>

      {/* Bookmark Button (only shown if type === "book") */}
      {type === "book" && (
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
            isBookmarked ? "bg-red-500" : "bg-green-500"
          } text-white hover:opacity-90 flex items-center justify-center w-10`}
        >
          {isBookmarked ? (
            <i className="fa-solid fa-bookmark-slash text-sm" style={{ pointerEvents: "none" }} />
          ) : (
            <i className="fa-solid fa-bookmark text-sm" style={{ pointerEvents: "none" }} />
          )}
        </button>
      )}
    </div>
  );
};

export default AudioControl;
