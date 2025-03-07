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
        const response = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setUploadStatus("Upload successful! Extracting text...");
          fetchExtractedText(data.filePath);
        } else {
          setUploadStatus("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("Error uploading file.");
      }
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const fetchExtractedText = async (filePath) => {
    try {
      const response = await fetch(`http://localhost:3000/api/extract-text?filePath=${filePath}`);
      const data = await response.json();

      if (response.ok) {
        setUploadStatus("Text extracted successfully!");
        onFileSelect(data.pages); // Pass structured page-wise text to parent
      } else {
        setUploadStatus("Failed to extract text.");
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      setUploadStatus("Error extracting text.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Upload a PDF Book</h2>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
        Select PDF
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {uploadStatus && (
        <p className="mt-4 text-gray-300 text-sm">{uploadStatus}</p>
      )}
    </div>
  );
};

export default PDFUpload;
