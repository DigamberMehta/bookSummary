import React, { useState } from "react";
import PDFUpload from "@/components/PDFUpload";
import Book from "@/components/Book";

const Home = () => {
  const [extractedPages, setExtractedPages] = useState(null);

  return (
    <>
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6">
          <PDFUpload onFileSelect={setExtractedPages} />
        </div>

        {extractedPages && (
          <div className="mt-6">
            <p className="text-green-400">Text extracted successfully!</p>
            <Book extractedPages={extractedPages} />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
