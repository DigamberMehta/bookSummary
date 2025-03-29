import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "react-modal";
import ReactMarkdown from 'react-markdown';

Modal.setAppElement('#root');

const SummaryFeatures = ({ currentPage, summaries, extractedPages, pagesReadCounter, onResetPagesRead }) => {
  const [showSummaryNotification, setShowSummaryNotification] = useState(false);
  const [showCustomSummaryModal, setShowCustomSummaryModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [customPageRange, setCustomPageRange] = useState('');
  const lastContentPageNumber = extractedPages?.length || 0;
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [hasUserDismissedSummary, setHasUserDismissedSummary] = useState(false);

  useEffect(() => {
    // Show notification only if the user has read at least 5 pages and hasn't dismissed it yet
    if (pagesReadCounter >= 5 && !hasUserDismissedSummary) {
      setShowSummaryNotification(true);
    } else {
      setShowSummaryNotification(false);
    }
  }, [pagesReadCounter, hasUserDismissedSummary]);

  const getPageTextByApiPageNumber = useCallback((apiPageNumber) => {
    const contentPageIndex = apiPageNumber - 1;
    return extractedPages?.[contentPageIndex]?.text || null;
  }, [extractedPages]);

  const handleOpenChatModal = useCallback(() => {
    setChatMessages([]);
    setShowChatModal(true);
  }, []);

  const handleCloseChatModal = useCallback(() => {
    setShowChatModal(false);
    setChatMessages([]);
  }, []);

  const handleApiRequest = useCallback(async (requestBody, successCallback, failureCallback) => {
    setIsSummaryLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/chatbot/page-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json();
        failureCallback(errorData.error || "Failed to process.");
      } else {
        const data = await response.json();
        successCallback(data.response);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      failureCallback("Failed to process.");
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  const handleRequestSummary = useCallback(async (actionType, pageRange) => {
    setShowSummaryNotification(false);
    handleOpenChatModal();

    const currentContentPageNumber = Math.floor((currentPage + 1) / 2);
    const endApiPage = pageRange ? parseInt(pageRange.split('-')[1]) : currentContentPageNumber;
    const startApiPage = pageRange ? parseInt(pageRange.split('-')[0]) : Math.max(1, endApiPage - 4);

    const relevantPageTexts = {};
    for (let i = startApiPage; i <= endApiPage; i++) {
      const pageText = getPageTextByApiPageNumber(i);
      if (pageText) {
        relevantPageTexts[i] = pageText;
      }
    }

    if (startApiPage > lastContentPageNumber || endApiPage < 1) {
      setChatMessages([{ sender: "bot", text: "No relevant pages read yet." }]);
      // Do not reset progress here, it should be a separate action
      return;
    }

    if (Object.keys(relevantPageTexts).length === 0) {
      setChatMessages([{ sender: "bot", text: "No content available for the specified range." }]);
      // Do not reset progress here
      return;
    }

    const requestBody = {
      actionType: actionType,
      summaries: relevantPageTexts,
      ...(pageRange && { pageRange }),
    };

    handleApiRequest(
      requestBody,
      (response) => setChatMessages([{ sender: "bot", text: response }]),
      (error) => setChatMessages([{ sender: "bot", text: error }])
    );
    // Removed .finally(onResetPagesRead) here, progress reset is now separate
  }, [currentPage, getPageTextByApiPageNumber, handleApiRequest, handleOpenChatModal, lastContentPageNumber]);

  const handleRequestLast5PageSummary = useCallback(() => {
    handleRequestSummary("combine");
  }, [handleRequestSummary]);

  const handleOpenCustomSummaryModal = useCallback(() => {
    setShowSummaryNotification(false);
    setShowCustomSummaryModal(true);
  }, []);

  const handleCloseCustomSummaryModal = useCallback(() => {
    setShowCustomSummaryModal(false);
  }, []);

  const handleCustomPageRangeChange = useCallback((event) => {
    setCustomPageRange(event.target.value);
  }, []);

  const handleRequestCustomSummary = useCallback(async () => {
    if (!customPageRange) {
      alert("Please enter a page range.");
      setShowCustomSummaryModal(true);
      return;
    }
    handleRequestSummary("discuss", customPageRange);
    setCustomPageRange('');
  }, [customPageRange, handleRequestSummary]);

  const handleChatMessageChange = useCallback((event) => {
    setCurrentChatMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (currentChatMessage.trim()) {
      const newUserMessage = { sender: "user", text: currentChatMessage };
      setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setCurrentChatMessage('');
      setIsSummaryLoading(true);

      const requestBody = {
        actionType: "chat",
        messages: [...chatMessages, newUserMessage],
        currentPage: currentPage,
        summaries: summaries,
        extractedPages: extractedPages,
      };

      handleApiRequest(
        requestBody,
        (response) => setChatMessages((prevMessages) => [...prevMessages, { sender: "bot", text: response }]),
        (error) => setChatMessages((prevMessages) => [...prevMessages, { sender: "bot", text: error }])
      );
    }
  }, [chatMessages, currentChatMessage, currentPage, extractedPages, handleApiRequest, summaries]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleDismissSummaryNotification = useCallback(() => {
    setShowSummaryNotification(false);
    setHasUserDismissedSummary(true);
    // Do not reset progress here
  }, []);

  return (
    <>
      {showSummaryNotification && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-4 z-50">
          <p className="text-gray-700 mb-2">Do you want to discuss the last 5 pages?</p>
          <div className="flex justify-center gap-4">
            <button onClick={handleRequestLast5PageSummary} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">Yes</button>
            <button
              onClick={handleDismissSummaryNotification}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
            >
              No
            </button>
          </div>
          <button onClick={handleOpenCustomSummaryModal} className="mt-2 block w-full text-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">Discuss a custom range</button>
        </div>
      )}

      <Modal isOpen={showCustomSummaryModal} onRequestClose={handleCloseCustomSummaryModal} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000 }, content: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '400px', width: '90%', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' } }}>
        <h2 className="text-lg font-bold mb-4">Discuss Custom Page Range</h2>
        <label htmlFor="pageRange" className="block text-gray-700 text-sm font-bold mb-2">Enter page range (e.g., 1-5):</label>
        <input type="text" id="pageRange" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" value={customPageRange} onChange={handleCustomPageRangeChange} />
        <div className="flex justify-end gap-2">
          <button onClick={handleRequestCustomSummary} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">Discuss</button>
          <button onClick={handleCloseCustomSummaryModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1">Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={showChatModal} onRequestClose={handleCloseChatModal} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000 }, content: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '700px', width: '95%', maxHeight: '90vh', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' } }}>
        <h2 className="text-lg font-bold mb-4">Chat</h2>
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 pr-2">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[80%] break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 text-gray-800 rounded-bl-none'}`}>
                <p className="text-xs font-semibold mb-1">{msg.sender === 'user' ? 'You' : 'Bot'}</p>
                <ReactMarkdown components={{ p: ({ ...props }) => <p className="text-sm" {...props} /> }}>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isSummaryLoading && (
            <div className="flex justify-center items-center h-16">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input type="text" className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Type your message..." value={currentChatMessage} onChange={handleChatMessageChange} onKeyPress={(event) => event.key === 'Enter' && handleSendMessage()} />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1" onClick={handleSendMessage}>Send</button>
        </div>
        <button className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1" onClick={handleCloseChatModal}>Close Chat</button>
      </Modal>
    </>
  );
};

export default SummaryFeatures;