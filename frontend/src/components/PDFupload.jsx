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
    <div className="flex flex-col items-center">
      <h2 className="mb-6 text-2xl font-bold text-white">Upload Your PDF</h2>

      <label className="group relative cursor-pointer">
        <div className="flex h-32 w-96 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 p-6 transition-all hover:border-blue-500 hover:bg-gray-700">
          <svg
            className="mb-3 h-12 w-12 text-gray-400 transition group-hover:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-center text-sm font-medium text-gray-300">
            Click to select PDF file
            <br />
            <span className="text-xs text-gray-400">(Max size: 25MB)</span>
          </span>
        </div>

        <input
          type="file"
          accept="application/pdf"
          className="absolute inset-0 h-full w-full opacity-0"
          onChange={handleFileChange}
        />
      </label>

      {uploadStatus && (
        <div className="mt-6 w-full max-w-md">
          <div className="flex items-center justify-center space-x-2">
            {uploadStatus === "Uploading..." ||
            uploadStatus.includes("Extracting") ||
            uploadStatus.includes("Saving") ? (
              <svg
                className="h-5 w-5 animate-spin text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <span
              className={`text-sm ${
                uploadStatus.includes("success") ? "text-green-400" : "text-gray-300"
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