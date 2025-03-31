import { Book, Palette, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

const Bookmark = ({
  colors,
  selectedColor,
  setSelectedColor,
  bookmarks,
  goToBookmark
}) => {
  return (
    <Card className="p-2 rounded-md flex items-center gap-2">
      {/* Bookmarks Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            <Book className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-60 overflow-y-auto">
          {bookmarks.length > 0 ? (
            bookmarks.map((bookmark, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => goToBookmark(bookmark.pageNumber)}
                className="gap-2"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: bookmark.color }}
                />
                <span>Page {bookmark.pageNumber}</span>
                {bookmark.textSnippet && (
                  <span className="text-muted-foreground text-xs line-clamp-1">
                    {bookmark.textSnippet}
                  </span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              No bookmarks yet
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color Picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <div 
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: selectedColor }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="grid grid-cols-4 gap-1 p-2">
            {colors.map((color) => (
              <DropdownMenuItem
                key={color}
                onClick={() => setSelectedColor(color)}
                className="p-0"
              >
                <div 
                  className="h-6 w-6 rounded-full border cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default Bookmark;