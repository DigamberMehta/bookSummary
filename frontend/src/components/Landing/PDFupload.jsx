import React, { useState } from "react";

const PDFUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus("Uploading...");

      const formData = new FormData();
      formData.append("pdf", file);

      try {
        // Step 1: Upload PDF
        const uploadResponse = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          setUploadStatus("Upload failed. Please try again.");
          return;
        }

        // Step 2: Extract text from PDF
        setUploadStatus("Upload successful! Extracting text...");
        const extractResponse = await fetch(
          `http://localhost:3000/api/extract-text?filePath=${uploadData.filePath}`
        );
        const extractData = await extractResponse.json();

        if (!extractResponse.ok) {
          setUploadStatus("Failed to extract text.");
          return;
        }

        // Step 3: Save book to database
        setUploadStatus("Saving book...");
        const bookResponse = await fetch("http://localhost:3000/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pages: extractData.pages.map((page) => ({
              pageNumber: page.pageNumber,
              text: page.text,
            })),
          }),
        });

        const bookData = await bookResponse.json();

        if (bookResponse.ok) {
          setUploadStatus("Book saved successfully!");
          onFileSelect(bookData.bookId); // Pass book ID to parent
        } else {
          setUploadStatus("Failed to save book.");
        }
      } catch (error) {
        console.error("Error:", error);
        setUploadStatus("An error occurred. Please try again.");
      }
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-2">
          Upload Your PDF
        </h2>
        <p className="text-gray-600 max-w-prose">
          Transform your documents into smart, searchable content with our secure PDF processing
        </p>
      </div>

      <label className="group relative cursor-pointer w-full max-w-2xl">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 transition-all hover:border-indigo-500 hover:bg-indigo-50/30 h-96">
          <div className="mb-6 transition-transform group-hover:scale-110">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-30 animate-ping"></div>
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-600 rounded-full text-white relative">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-lg font-medium text-gray-900">
              Drag & drop or <span className="text-indigo-600">browse files</span>
            </p>
            <p className="text-sm text-gray-500">
              Supported format: PDF • Max size: 25MB
            </p>
          </div>
        </div>

        <input
          type="file"
          accept="application/pdf"
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </label>

      {uploadStatus && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center space-x-3 rounded-lg bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex-shrink-0">
              {uploadStatus === "Uploading..." ||
              uploadStatus.includes("Extracting") ||
              uploadStatus.includes("Saving") ? (
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <div className="h-full w-full animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
            <span
              className={`text-base ${
                uploadStatus.includes("success") 
                  ? "text-green-700" 
                  : uploadStatus.includes("failed") 
                    ? "text-red-700"
                    : "text-gray-700"
              }`}
            >
              {uploadStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;