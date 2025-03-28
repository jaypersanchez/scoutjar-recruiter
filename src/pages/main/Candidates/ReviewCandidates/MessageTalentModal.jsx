// At the top of the file
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

export default function MessageTalentModal({ applicant, onClose }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // Retrieve the recruiter (scout) user info from sessionStorage
  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;

  // Define fetchHistory so that it can be reused
  const fetchHistory = async () => {
    setLoadingHistory(true);
    setHistoryError("");
    try {
      const response = await fetch(
        `http://localhost:5000/messages/history?sender_id=${recruiterId}&recipient_id=${applicant.talent_id}`
      );
      const data = await response.json();
      if (response.ok) {
        setHistory(data);
      } else {
        setHistoryError("Error loading history: " + data.error);
      }
    } catch (error) {
      setHistoryError("Error loading history: " + error.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch message history when the modal loads
  useEffect(() => {
    fetchHistory();
  }, [applicant.talent_id, recruiterId]);

  const handleSendMessage = async () => {
    setSending(true);
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:5000/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: recruiterId,
          recipient_id: applicant.talent_id,
          content: message,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Message sent successfully!");
        setMessage("");
        // Wait 3 seconds before refreshing the conversation history
        setTimeout(() => {
          fetchHistory();
        }, 3000);
      } else {
        setErrorMessage("Error sending message: " + data.error);
      }
    } catch (error) {
      setErrorMessage("Error sending message: " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-4">
          Message to {applicant.full_name}
        </h3>
        
        {/* Message History */}
        <div className="mb-4 max-h-64 overflow-y-auto border p-2">
          {loadingHistory ? (
            <p>Loading messages...</p>
          ) : historyError ? (
            <p className="text-red-500">{historyError}</p>
          ) : history.length > 0 ? (
            history.map((msg) => (
              <div key={msg.message_id} className="mb-2">
                <strong>
                  {msg.sender_id === recruiterId ? "You" : applicant.full_name}:
                </strong>{" "}
                <span>{msg.content}</span>
                <div className="text-xs text-gray-500">
                  {new Date(msg.sent_at).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
        
        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}
        <textarea
          className="form-input w-full mb-4"
          placeholder="Type your message here..."
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSendMessage}
            disabled={sending || message.trim() === ""}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
