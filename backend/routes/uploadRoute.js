import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import PDFParser from "pdf2json";

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload route
router.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  res.json({
    success: true,
    message: "File uploaded successfully!",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Extract text preserving page structure
router.get("/extract-text", async (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ success: false, message: "File path is required." });
  }

  const fullPath = path.join(uploadDir, path.basename(filePath));

  try {
    const pdfParser = new PDFParser();
    pdfParser.loadPDF(fullPath);

    pdfParser.on("pdfParser_dataError", (err) => {
      console.error("Error extracting text:", err);
      res.status(500).json({ success: false, message: "Failed to extract text from PDF." });
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const extractedPages = pdfData.Pages.map((page, index) => ({
        pageNumber: index + 1,
        text: page.Texts.map((textObj) => decodeURIComponent(textObj.R[0].T)).join(" "),
      }));

      res.json({
        success: true,
        pages: extractedPages, // Send structured page-wise text
      });
    });
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).json({ success: false, message: "Failed to extract text from PDF." });
  }
});

export default router;
