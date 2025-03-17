import React, { useState } from "react";

export default function MessageTalentModal({ applicant, onClose }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendMessage = async () => {
    setSending(true);
    setErrorMessage("");
    try {
      // Retrieve the recruiter (scout) user info from sessionStorage
      const storedUser = sessionStorage.getItem("sso-login");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const sender_id = user ? user.user_id : null;

      const response = await fetch("http://localhost:5000/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id, 
          recipient_id: applicant.user_id, // talent's user id
          content: message,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Message sent successfully!");
        onClose();
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
