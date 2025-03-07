import React, { useState } from "react";
import PDFUpload from "@/components/PDFUpload";
import Book from "@/components/Book";

const Home = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  return (
    <>
    <div>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6">
    
      <PDFUpload onFileSelect={setPdfUrl} />
      </div>
      {/* Show Book Viewer only if a PDF is uploaded */}
      {pdfUrl && (
        <div className="mt-6">
          <p className="text-green-400">PDF uploaded successfully!</p>
          <Book pdfUrl={pdfUrl} />
        </div>
      )}
    </div>
    </>
  );
};

export default Home;
