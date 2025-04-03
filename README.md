# AI-Powered Book Summarization Web App

An intelligent and interactive web application that allows users to upload PDF books and receive page-by-page AI-generated summaries, multilingual translations, text-to-speech narration, dictionary lookup, chatbot Q&A, reading progress tracking, and bookmarking features — all wrapped in a realistic animated book-reading interface.

## Features

* **Upload PDF Book:** Easily upload your PDF books to the application.
* **AI-Generated Summaries (per page):** Get concise summaries of each page powered by AI.
* **Multilingual Translation:** Translate book content into multiple languages.
* **Text-to-Speech (TTS) Narration:** Listen to the book being read aloud.
* **AI Chatbot Q&A ("Ask the Book"):** Ask questions about the book and receive AI-powered answers.
* **Dictionary Lookup:** Quickly look up the definition of any word.
* **Realistic Bookmarking System (paper strip style):** Bookmark your reading progress with a visually appealing paper strip.
* **Reading Progress Tracker:** Keep track of your reading progress.
* **Page Flipping Animation:** Enjoy a realistic page-turning experience using `react-pageflip`.
* **Dark Theme Interface:** Switch to a dark theme for comfortable night reading.

## Tech Stack

**Frontend:**

* React.js
* react-pageflip
* Tailwind CSS
* Axios

**Backend:**

* Node.js
* Express.js
* pdf-parse
* AI Integration (e.g., Gemini / OpenAI / Claude API)
* Text-to-Speech API
* Translation API (e.g., Google Translate API)
* Dictionary API

**Storage:**

* File System or Cloud (for PDF storage)
* LocalStorage (for bookmarks & progress)

## How It Works

1.  **User uploads a PDF book.**
2.  **System extracts text from each page.**
3.  **Each page is processed:**
    * AI generates summary
    * Translated if selected
    * TTS audio prepared
4.  **User flips through pages with dual-pane (original vs summary) view.**
5.  **Optional features:**
    * Ask questions using the AI chatbot
    * Listen to pages
    * Translate content
    * Add bookmarks
    * Look up dictionary words
    * Track reading progress

## How to Run Locally

1.  **Clone the Repo**

    ```bash
    git clone https://github.com/DigamberMehta/bookSummary
    cd bookSummary
    ```

2.  **Install Backend**

    ```bash
    cd backend
    npm install
    npm run dev
    ```

3.  **Install Frontend**

    ```bash
    cd ../frontend
    npm install
    npm start
    ```

  
## Screenshots

[Add screenshots/gifs here showing:]

* Book upload
* Page flip animation
* AI summary view
* Audio narration
* Bookmarking
* Chatbot Q&A

## API Usage

* `/api/upload` - **POST:** Upload PDF file and extract text content.
* `/api/summary` - **POST:** Get AI-generated summary for a specific page. (Request body: `{"page_number": number, "text": string}`)
* `/api/translate` - **POST:** Translate text content to a specified language. (Request body: `{"text": string, "target_language": string}`)
* `/api/tts` - **POST:** Convert text content to speech audio. (Request body: `{"text": string}`)
* `/api/chatbot` - **POST:** Ask AI-based questions about the book. (Request body: `{"question": string, "book_content": string}`)
* `/api/dictionary` - **GET:** Look up the definition of a word. (Query parameter: `word`)

 

 
