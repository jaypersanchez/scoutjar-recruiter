import React from "react";
import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";

export default function GlobalChatSidebar() {
  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;
  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;

  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false); // <-- ADD

  const fetchChatList = async () => {
    if (!recruiterId) return;
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/messages/chats?recruiter_id=${recruiterId}`);
      const data = await response.json();
      if (response.ok) {
        setChatList(data);
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatList();
    const interval = setInterval(fetchChatList, 10000);
    return () => clearInterval(interval);
  }, [recruiterId]);

  if (!recruiterId) return null;

  return (
    <>
      {activeChat && (
        <ChatWindow
          recruiterId={recruiterId}
          talent={activeChat}
          closeChat={() => setActiveChat(null)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed bottom-4 right-4 ${minimized ? "h-14" : "h-[500px]"} w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-40 flex flex-col`}>
        <div className="bg-gray-800 text-white p-3 rounded-t-lg font-bold flex justify-between items-center">
          <span>Messages</span>
          <button onClick={() => setMinimized(!minimized)} className="minimize-button">
            {minimized ? "▢" : "–"}
          </button>
        </div>

        {!minimized && (
          <div className="flex-1 overflow-y-auto p-3 text-sm">
            {loading ? (
              <p>Loading chats...</p>
            ) : (
              chatList.map((chat) => (
                <div
                  key={chat.talent_id}
                  onClick={() => setActiveChat(chat)}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer mb-2"
                >
                  <div className="font-semibold">{chat.talent_name}</div>
                  <div className="text-xs text-gray-500 truncate">{chat.last_message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
