import React from "react";

const AudioControl = ({
  text,
  type,
  handleAudio,
  playingType,
  audioStatus,
  loadingType,
  isBookmarked,
  toggleBookmark,
}) => {
  // Decide main button icon
  let icon = <i className="fa-solid fa-play text-sm" style={{ pointerEvents: "none" }} />;
  let buttonColor = "bg-blue-500";

  if (loadingType === type) {
    icon = <i className="fa-regular fa-spinner fa-spin text-sm" style={{ pointerEvents: "none" }} />;
  } else if (playingType === type) {
    // If this type is active
    if (audioStatus === "playing") {
      icon = <i className="fa-solid fa-pause text-sm" style={{ pointerEvents: "none" }} />;
      buttonColor = "bg-red-500"; 
    } else if (audioStatus === "paused") {
      icon = <i className="fa-solid fa-play text-sm" style={{ pointerEvents: "none" }} />;
      buttonColor = "bg-red-500";
    }
    // if audioStatus === "stopped", we show the default "play" but keep color blue or red – your choice
  }

  return (
    <div className="flex gap-2">
      {/* Play / Pause Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAudio(text, type);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`px-3 py-1 rounded-lg transition-colors ${buttonColor} text-white hover:opacity-90 flex items-center justify-center w-10`}
      >
        {icon}
      </button>

      {/* Bookmark Button only if type === "book" */}
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
