import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

 
router.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: "Text is required for summarization." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Summarize this text, do not use markdown: ${text}`);

    const summary = result.response.text();

    res.json({ success: true, summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ success: false, message: "Failed to generate summary." });
  }
});

export default router;
