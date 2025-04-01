import React from "react";
import Bookmark from "./Bookmark";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = ({
 colors,
 selectedColor,
 setSelectedColor,
 bookmarks,
 goToBookmark,
 bookTitle,
 onEditButtonClick,
 selectedVoice,
 handleVoiceChange,
 fontSize,
 setFontSize,
 customFontSize,
 setCustomFontSize, // This is now debounced
 pendingCustomFontSize,
 setPendingCustomFontSize,
 goToPageNumber,
 handleGoToPageInputChange,
 handleGoToPage,
 totalDynamicPages,
 extractedPages,
 readingSpeed, // Receive reading speed as a prop
}) => {
 const handleFontSizeChange = (value) => {
 setFontSize(value);
 if (value !== "custom") {
 setPendingCustomFontSize(customFontSize); // Sync pending with current when switching away
 }
 };

 const handleCustomFontSizeChange = (event) => {
 const value = event.target.value;
 if (value === "") {
 setPendingCustomFontSize(""); // Allow empty input temporarily
 setCustomFontSize(14); // Reset to default after debounce
 setFontSize("medium");
 } else {
 const numValue = parseInt(value, 10);
 if (!isNaN(numValue) && numValue > 0) {
  setPendingCustomFontSize(numValue); // Update input value immediately
  setCustomFontSize(numValue); // Debounced update to actual state
 }
 }
 };

 return (
 <div className="w-full p-4 bg-white/10 backdrop-blur-sm sticky top-0 z-10 mb-4 rounded-lg border border-black">
 <div className="grid grid-cols-3 items-center w-full">
  <div className="flex items-center gap-4">
     <Bookmark
       colors={colors}
       selectedColor={selectedColor}
       setSelectedColor={setSelectedColor}
       bookmarks={bookmarks}
       goToBookmark={goToBookmark}
     />
     <div className="w-48">
       <Select
         value={`${selectedVoice.name.split('-').pop()},${selectedVoice.ssmlGender}`}
         onValueChange={(value) => handleVoiceChange({ target: { value } })}
       >
         <SelectTrigger className="text-black bg-white border border-black focus:ring-2 focus:ring-gray-500 h-8">
           <SelectValue placeholder="Select voice" />
         </SelectTrigger>
         <SelectContent className="bg-white text-black border border-black">
           <SelectItem value="A,MALE">en-US-Wavenet-A (Male)</SelectItem>
           <SelectItem value="B,MALE">en-US-Wavenet-B (Male)</SelectItem>
           <SelectItem value="C,FEMALE">en-US-Wavenet-C (Female)</SelectItem>
           <SelectItem value="D,MALE">en-US-Wavenet-D (Male)</SelectItem>
           <SelectItem value="E,FEMALE">en-US-Wavenet-E (Female)</SelectItem>
           <SelectItem value="F,FEMALE">en-US-Wavenet-F (Female)</SelectItem>
           <SelectItem value="G,FEMALE">en-US-Wavenet-G (Female)</SelectItem>
           <SelectItem value="H,MALE">en-US-Wavenet-H (Male)</SelectItem>
           <SelectItem value="I,MALE">en-US-Wavenet-I (Male)</SelectItem>
           <SelectItem value="J,MALE">en-US-Wavenet-J (Male)</SelectItem>
         </SelectContent>
       </Select>
     </div>
     <div className="text-gray-800 text-sm" >
         {readingSpeed > 0 ? `${readingSpeed} WPM` : "Calculating speed..."}
     </div>
  </div>

  <h2 className="text-xl font-semibold text-black text-center">{bookTitle}</h2>

  <div className="flex justify-end items-center gap-4">
     <div className="flex items-center gap-2">
       <Label htmlFor="go-to-page" className="text-sm text-black">Go to:</Label>
       <Input
         type="number"
         id="go-to-page"
         className="w-20 text-black bg-white border border-black focus:ring-2 focus:ring-gray-500 h-8 text-sm"
         value={goToPageNumber}
         onChange={handleGoToPageInputChange}
         min="1"
         max={extractedPages.length} // Use extractedPages.length as the max for original page number
       />
       <Button onClick={handleGoToPage} variant="outline" size="sm" className="h-8">
         Go
       </Button>
     </div>

     <div className="w-48">
       <Select value={fontSize} onValueChange={handleFontSizeChange}>
         <SelectTrigger className="text-black bg-white border border-black focus:ring-2 focus:ring-gray-500 h-8">
           <SelectValue placeholder="Font Size" />
         </SelectTrigger>
         <SelectContent className="bg-white text-black border border-black">
           <SelectItem value="small">Small</SelectItem>
           <SelectItem value="medium">Medium</SelectItem>
           <SelectItem value="large">Large</SelectItem>
           <SelectItem value="extra-large">Extra Large</SelectItem>
           <SelectItem value="custom">Custom (px)</SelectItem>
         </SelectContent>
       </Select>
     </div>

     {fontSize === "custom" && (
       <div className="w-24">
         <Input
           type="number"
           value={pendingCustomFontSize} // Show pending value immediately
           onChange={handleCustomFontSizeChange}
           className="text-black bg-white border border-black focus:ring-2 focus:ring-gray-500 h-8"
           min="1"
         />
       </div>
     )}

     <button
       onClick={onEditButtonClick}
       className="px-4 py-1.5 bg-white text-black border border-black rounded-md hover:bg-gray-200 transition-colors text-sm"
     >
       Edit Book
     </button>
  </div>
 </div>
 </div>
 );
};

export default Header;