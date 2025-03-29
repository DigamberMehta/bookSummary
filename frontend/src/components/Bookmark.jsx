import { Book, Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const Bookmark = ({
  colors,
  selectedColor,
  setSelectedColor,
  bookmarks,
  goToBookmark
}) => {
  return (
    <Card className="w-full p-4 rounded-lg shadow-lg sticky top-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col gap-4">
        {/* Color Selection Dropdown */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Bookmarks</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Palette className="h-4 w-4" />
                <div 
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: selectedColor }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <div className="grid grid-cols-4 gap-2 p-2">
                {colors.map((color) => (
                  <DropdownMenuItem
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="p-0 flex justify-center"
                  >
                    <div className="relative">
                      <div
                        className="h-8 w-8 rounded-full border-2 cursor-pointer transition-all"
                        style={{ backgroundColor: color }}
                      />
                      {selectedColor === color && (
                        <Check className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length > 0 && (
          <ScrollArea className="h-[200px]">
            <div className="flex flex-col gap-2 pr-4">
              {bookmarks.map((bookmark, index) => (
                <Card
                  key={index}
                  className="group flex items-center p-3 cursor-pointer transition-colors hover:bg-accent"
                  onClick={() => goToBookmark(bookmark.pageNumber)}
                >
                  <div
                    className="h-full w-2 rounded-l-md mr-3"
                    style={{ backgroundColor: bookmark.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Page {bookmark.pageNumber}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {bookmark.textSnippet}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default Bookmark;