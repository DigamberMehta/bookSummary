import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Replace with your actual ChatGPT API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const chatHistory = {};

// Define the chatbot route (existing)
router.post("/chatbot", async (req, res) => {
  const { message, currentPageText, sessionId } = req.body;

  if (!message || !currentPageText) {
    return res.status(400).json({ error: "Missing message or context" });
  }

  const currentSessionId = sessionId || "default_session";

  if (!chatHistory[currentSessionId]) {
    chatHistory[currentSessionId] = [];
  }

  // Add user message to chat history
  chatHistory[currentSessionId].push({ role: "user", content: message });

  try {
    const modelName = "gpt-3.5-turbo";

    const messages = [
      {
        role: "system",
        content: `You are a helpful chatbot assisting a user reading a book. The current page contains: "${currentPageText}". Answer the user's question based on this context and the previous conversation.`,
      },
      ...chatHistory[currentSessionId],
    ];

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: messages,
    });

    if (!completion.choices || completion.choices.length === 0) {
      return res.status(500).json({ error: "No response from the model" });
    }

    const text = completion.choices[0].message.content;

    chatHistory[currentSessionId].push({ role: "assistant", content: text });

    res.json({ response: text });
  } catch (error) {
    console.error("Error processing chatbot request:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to process message" });
  }
});

// New route for combining summary or discussing previous pages
// In-memory store for chat histories (for demonstration purposes)
const chatHistories = {};

router.post("/chatbot/page-action", async (req, res) => {
  const {
    actionType,
    pageRange,
    summaries,
    messages,
    currentPage,
    extractedPages,
  } = req.body;

  // Simple way to get a user identifier (replace with your actual user identification logic)
  const userId = req.sessionID || "anonymous";

  if (!actionType) {
    return res.status(400).json({ error: "Missing action type" });
  }

  try {
    if (actionType === "combine" && summaries) {
      // Combine summaries
      const combinedSummary = Object.values(summaries)
        .filter((summary) => summary)
        .join("\n\n");
      res.json({ response: combinedSummary });
    } else if (actionType === "discuss" && pageRange && summaries) {
      // Discuss previous pages
      const [startPage, endPage] = pageRange.split("-").map(Number);
      if (isNaN(startPage) || isNaN(endPage) || startPage > endPage) {
        return res.status(400).json({ error: "Invalid page range" });
      }

      const relevantSummaries = Object.entries(summaries)
        .filter(([pageNumber, summary]) => {
          const pageNum = parseInt(pageNumber);
          return pageNum >= startPage && pageNum <= endPage && summary;
        })
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0])) // Sort by page number
        .map(([pageNumber, summary]) => `Page ${pageNumber}: ${summary}`)
        .join("\n\n");

      if (!relevantSummaries) {
        return res.json({
          response: "No summaries available for the specified range.",
        });
      }

      const modelName = "gpt-3.5-turbo";
      const prompt = `The user wants to discuss pages ${startPage} to ${endPage}. Here are the summaries:\n\n${relevantSummaries}\n\nWhat are some potential discussion points or key takeaways?`;

      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
      });

      if (!completion.choices || completion.choices.length === 0) {
        return res.status(500).json({ error: "No response from the model" });
      }

      const discussionResponse = completion.choices[0].message.content;
      res.json({ response: discussionResponse });
    } else if (
      actionType === "chat" &&
      messages &&
      summaries &&
      currentPage &&
      extractedPages
    ) {
      // Handle chat requests with history
      const modelName = "gpt-3.5-turbo";

      // Initialize chat history for the user if it doesn't exist
      if (!chatHistories[userId]) {
        chatHistories[userId] = [];
      }

      // Add the user's message to the history
      if (messages && messages.length > 0) {
        const latestUserMessage = messages[messages.length - 1];
        chatHistories[userId].push({
          role: "user",
          content: latestUserMessage.text,
        });
      }

      // Construct the prompt with the latest history
      let promptMessages = [...chatHistories[userId]];

      // Add context about the current page (optional, can be included in the prompt)
      const currentPageNumber = Math.ceil(currentPage / 2);
      const currentSummary =
        summaries[currentPageNumber] ||
        "No summary available for the current page.";
      const currentPageText =
        extractedPages.find((page) => page.pageNumber === currentPageNumber)
          ?.text || "No content available for the current page.";

      promptMessages.push({
        role: "system",
        content: `You are a helpful chatbot assisting a user reading a book. The current page number is ${currentPageNumber}. Here's the summary of the current page: ${currentSummary}. Here's the content of the current page (if available): ${currentPageText}`,
      });

      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: promptMessages,
      });

      if (!completion.choices || completion.choices.length === 0) {
        return res.status(500).json({ error: "No response from the model" });
      }

      const chatResponse = completion.choices[0].message.content;

      // Add the chatbot's response to the history
      chatHistories[userId].push({ role: "assistant", content: chatResponse });

      res.json({ response: chatResponse });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid action type or missing required parameters" });
    }
  } catch (error) {
    console.error("Error processing page action request:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to process page action" });
  }
});
export default router;
