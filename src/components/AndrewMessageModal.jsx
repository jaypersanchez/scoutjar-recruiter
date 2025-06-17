import React from "react";
import { useState, useEffect } from "react";

export default function AndrewMessageModal({ talent, onClose }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;
  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;
  
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(
        `${baseUrl}/messages/history/andrew?sender_id=${recruiterId}&recipient_user_id=${talent.user_id}`
      );
      const data = await response.json();
      if (response.ok) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Error fetching message history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };
  

  useEffect(() => {
    fetchHistory();
  }, [talent.talent_id, recruiterId]);

  const handleSendMessage = async () => {
    setSending(true);
    try {
        if (!recruiterId || !talent?.user_id || !message.trim()) {
            setErrorMessage("Missing recruiter or recipient information.");
            return;
          }
          
        const response = await fetch(`${baseUrl}/messages/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender_id: recruiterId,
              recipient_id: talent.user_id,   // ✅ MUST be user_id
              content: message,
            }),
          });
          
      const data = await response.json();
      if (response.ok) {
        setMessage("");
        setTimeout(fetchHistory, 3000);
      } else {
        setErrorMessage(data.error || "Failed to send message.");
      }
    } catch (error) {
      setErrorMessage(error.message);
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
          Message to {talent.full_name}
        </h3>

        <div className="mb-4 max-h-64 overflow-y-auto border p-2">
          {loadingHistory ? (
            <p>Loading messages...</p>
          ) : history.length > 0 ? (
            history.map((msg) => (
              <div key={msg.message_id} className="mb-2">
                <strong>{msg.sender_id === recruiterId ? "You" : talent.full_name}:</strong>{" "}
                {msg.content}
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
          <p className="text-red-500 mb-2">{errorMessage}</p>
        )}

        <textarea
          className="form-input w-full mb-4"
          rows="4"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
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
