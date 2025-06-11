import React, { useState, useEffect, useRef } from "react";

export default function ChatWindow({ recruiterId, talent, closeChat }) {
  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false); // <-- ADD

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!recruiterId || !talent?.talent_id) return;
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/messages/history?sender_id=${recruiterId}&recipient_id=${talent.talent_id}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/messages/send-to-talent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: recruiterId,
          talent_id: talent.talent_id,
          content: newMessage,
        }),
      });
      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [recruiterId, talent?.talent_id]);

  return (
    <div className="fixed bottom-4 right-[340px] w-96 h-[600px] flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg z-40">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-3 rounded-t-lg">
        <span className="font-bold">{talent.talent_name}</span>
        <div className="flex gap-2">
          <button onClick={() => setMinimized(!minimized)} className="minimize-button">
            {minimized ? "▢" : "–"}
          </button>
          <button onClick={closeChat} className="text-white text-lg font-bold">
            ✖
          </button>
        </div>
      </div>

      {/* Scrollable messages */}
      {!minimized && (
        <>
          <div className="flex-1 min-h-0 overflow-y-auto p-3 bg-gray-50 text-sm">
            {loading ? (
              <p>Loading...</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.message_id} className="mb-2">
                  <div className={`font-semibold ${msg.sender_id === recruiterId ? 'text-blue-600' : 'text-gray-700'}`}>
                    {msg.sender_id === recruiterId ? "You" : talent.talent_name}:
                  </div>
                  <div className={`p-2 rounded-md ${msg.sender_id === recruiterId ? 'bg-blue-100' : 'bg-gray-200'}`}>
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(msg.sent_at).toLocaleString()}
                  </div>
                  <hr className="my-1" />
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input + Send */}
          <div className="p-3 flex gap-2 items-center border-t bg-white">
            <input
              type="text"
              className="flex-1 border rounded p-2"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="chat-send-button"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
