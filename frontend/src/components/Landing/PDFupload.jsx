import React, { useState } from "react";
const PDFUpload = ({ onFileSelect, apiBaseUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const categories = [
    {
      name: "Technical",
      subcategories: ["Operating Systems", "AI", "Computer Networks", "Programming"],
    },
    {
      name: "Fictional",
      subcategories: ["Science Fiction", "Fantasy", "Mystery", "Thriller"],
    },
    {
      name: "Educational",
      subcategories: ["History", "Science", "Mathematics", "Literature"],
    },
    {
      name: "Other",
      subcategories: [],
    },
  ];

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus("Uploading...");
      const formData = new FormData();
      formData.append("pdf", file);
      try {
        // Step 1: Upload PDF
        const uploadResponse = await fetch(`${apiBaseUrl}/api/upload`, {
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
          `${apiBaseUrl}/api/extract-text?filePath=${uploadData.filePath}`
        );
        const extractData = await extractResponse.json();
        if (!extractResponse.ok) {
          setUploadStatus("Failed to extract text.");
          return;
        }
        // Step 3: Ask for book category
        setUploadStatus("Text extracted successfully!");
        setShowCategoryModal(true);
        // Store the extracted data temporarily
        sessionStorage.setItem("extractedPages", JSON.stringify(extractData.pages));
      } catch (error) {
        console.error("Error:", error);
        setUploadStatus("An error occurred. Please try again.");
      }
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory(""); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const handleSaveBook = async () => {
    setUploadStatus("Saving book...");
    setShowCategoryModal(false);
    const extractedPages = JSON.parse(sessionStorage.getItem("extractedPages"));
    try {
      const bookResponse = await fetch(`${apiBaseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: extractedPages.map((page) => ({
            pageNumber: page.pageNumber,
            text: page.text,
          })),
          category: selectedCategory || null,
          subcategory: selectedSubcategory || null,
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
  };

  const handleSkipCategory = async () => {
    setUploadStatus("Saving book...");
    setShowCategoryModal(false);
    const extractedPages = JSON.parse(sessionStorage.getItem("extractedPages"));
    try {
      const bookResponse = await fetch(`${apiBaseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: extractedPages.map((page) => ({
            pageNumber: page.pageNumber,
            text: page.text,
          })),
          category: null,
          subcategory: null,
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
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-2">
          Upload Your PDF
        </h2>
        <p className="text-gray-600 max-w-prose">
          Transform your documents into smart, searchable content with our secure
          PDF processing
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
              Drag & drop or{" "}
              <span className="text-indigo-600">browse files</span>
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
      {uploadStatus && !showCategoryModal && (
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

      {showCategoryModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Categorize Your Book (Optional)</h2>
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && selectedCategory !== "Other" && (
                <div className="mb-4">
                  <label htmlFor="subcategory" className="block text-gray-700 text-sm font-bold mb-2">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
                  >
                    <option value="">Select Subcategory</option>
                    {categories
                      .find((cat) => cat.name === selectedCategory)
                      ?.subcategories.map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleSkipCategory}
                >
                  Skip
                </button>
                <button
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleSaveBook}
                >
                  Save Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PDFUpload;