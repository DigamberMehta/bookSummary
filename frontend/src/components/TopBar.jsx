import React from "react";

const TopBar = ({ 
  colors, 
  selectedColor, 
  setSelectedColor, 
  bookmarks, 
  goToBookmark 
}) => {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-lg mb-2 shadow-lg sticky top-2 z-50">
      <div className="flex flex-col gap-4">
        {/* Color Selection */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-gray-600 font-medium">Bookmark Color:</span>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  selectedColor === color ? "border-black scale-110" : "border-transparent"
                } hover:scale-105`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {bookmarks.map((bookmark, index) => (
                <button
                  key={index}
                  onClick={() => goToBookmark(bookmark.pageNumber)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
                  style={{ borderLeft: `6px solid ${bookmark.color}` }}
                >
                  <span className="text-gray-700 font-medium">Page {bookmark.pageNumber}</span>
                  <span className="text-gray-400 text-sm truncate max-w-[160px]">
                    {bookmark.textSnippet}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
