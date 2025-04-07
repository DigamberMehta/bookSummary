#  AI-Powered Book Summarization Web Application

An intelligent, interactive, and feature-rich web app that allows users to upload PDF books and receive AI-generated summaries for each page, along with features like TTS, translation, bookmarking, and a chatbot for Q&A.

---

##  Features

-  **PDF Upload and Text Extraction**
-  **AI-Powered Page-by-Page Summarization (Gemini/GPT)**
-  **Text-to-Speech (Google TTS API)**
-  **Multilingual Translation (Google Translate API)**
-  **Bookmarking and Quick Navigation**
-  **Reading Progress & WPM Tracking**
-  **AI Chatbot (Ask the Book)**
-  **Dictionary Widget with Live Lookup**
-  **Summary Notifications and Custom Range Discussion**
-  **Realistic Two-Page Book Reading Interface (Page Flip)**

---

## 🛠 Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- `react-pageflip`
- React Context API

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- `pdf2json` for PDF text extraction
- Google APIs (TTS & Translate)
- JWT Authentication

---

## 📁 Project Structure

```plaintext
root/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── uploads/
│   └── app.js
└── frontend/
    └── src/
        ├── components/
        │   ├── Book/
        │   ├── ChatBot/
        │   └── Landing/
        ├── pages/
        ├── context/
        └── main.jsx
```

---

##  Local Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone [https://github.com/your-username/book-summary-app.git](https://github.com/DigamberMehta/bookSummary)
cd bookSummary
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```



### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

 
