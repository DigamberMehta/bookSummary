// pages/api/chatbot.js
import OpenAI from 'openai';

// Replace with your actual ChatGPT API key
const OPENAI_API_KEY = "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";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// In-memory store for chat history (for demonstration purposes)
const chatHistory = {};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message, currentPageText, sessionId } = req.body; // Expecting a sessionId

    // Simple session management (you might want to use cookies or a more robust mechanism)
    const currentSessionId = sessionId || 'default_session'; // Use provided sessionId or a default

    // Initialize chat history for the session if it doesn't exist
    if (!chatHistory[currentSessionId]) {
      chatHistory[currentSessionId] = [];
    }

    

    // Add the current user message to the chat history
    chatHistory[currentSessionId].push({ role: 'user', content: message });
    console.log("Current Page Text:", currentPageText);

    try {
      const modelName = 'gpt-3.5-turbo'; // Or another preferred ChatGPT model

      // Construct the prompt including the current page text and the chat history
      let prompt = `You are a helpful chatbot assisting a user reading a book. The current page contains: "${currentPageText}". Answer the user's question based on this context and the previous conversation.`;

      // Add chat history to the messages array
      const messages = [
        { role: 'system', content: prompt }, // Initial system message
        ...chatHistory[currentSessionId],     // Include previous messages
      ];

      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: messages,
      });


      if (!completion.choices || completion.choices.length === 0) {
        console.error("API returned no choices:", completion);
        return res.status(500).json({ error: 'No response from the model' });
      }


      const text = completion.choices[0].message.content;

      if (text) {
        // Add the chatbot's response to the chat history
        chatHistory[currentSessionId].push({ role: 'assistant', content: text });
        return res.status(200).json({ response: text });
      } else {
        console.error("No valid text found in response:", completion);
        return res.status(500).json({ error: 'Empty response from the model' });
      }
    } catch (error) {
      console.error('Error processing chatbot request:', error);
      return res.status(500).json({ error: error.message || 'Failed to process message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}