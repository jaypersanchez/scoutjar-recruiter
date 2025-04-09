import React, { useState, useEffect } from "react";
import AndrewMessageModal from "./AndrewMessageModal"

export default function AndrewAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [noResults, setNoResults] = useState(false)
  const [suggestion, setSuggestion] = useState("");

  const toggleAssistant = () => setIsOpen(!isOpen);
  //const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;
  const AIbaseURL = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}`;
  useEffect(() => {
    setQuery("");
    setResults([]);
  }, []);

  /*const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${AIbaseURL}/search-talents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data.matches || []);
    } catch (err) {
      console.error("Error searching talents:", err);
      alert("Error searching talents.");
    } finally {
      setLoading(false);
    }
  };*/

  const handleSearch = async () => {
    setLoading(true);
    setNoResults(false);
    setSuggestion("");
  
    try {
      const response = await fetch(`${AIbaseURL}/search-talents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
  
      setResults(data.matches || []);
  
      if ((data.matches || []).length === 0 && data.suggestion) {
        setNoResults(true);
        setSuggestion(data.suggestion);
      }
    } catch (err) {
      console.error("Error searching talents:", err);
      alert("Error searching talents.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-lg w-[400px] h-[500px] p-4 border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Ask Lookk 🤖</h2>
            <button onClick={toggleAssistant} className="text-gray-500 hover:text-gray-800">✖</button>
          </div>

          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Ask Lookk to find talents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            className="mt-2 w-full bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "LOOKing..." : "Lookk for Talents"}
          </button>

          {loading && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {noResults && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="font-semibold mb-2">No matches found.</p>
              <p className="text-sm">{suggestion}</p>
            </div>
          )}


          <div className="mt-4 space-y-3 overflow-y-auto">
            {results.map((talent) => (
              <div
                key={talent.talent_id}
                className="border rounded p-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedTalent({
                  talent_id: talent.talent_id,
                  user_id: talent.user_id,
                  full_name: talent.name || "Talent",
                  ...talent
                })}
              >
                <div className="font-medium">{talent.name}</div>
                <div className="text-xs text-gray-500">
                  {talent.location} • {talent.availability}
                </div>
                <div className="text-xs mt-1 text-gray-700">
                  <strong>Skills:</strong> {(talent.skills || []).join(", ")}
                </div>
                <div className="text-xs mt-1 italic text-gray-600 whitespace-pre-wrap">
                  {talent.explanation}
                </div>
              </div>
            ))}
          </div>

          {selectedTalent && (
            <AndrewMessageModal
              talent={selectedTalent}
              onClose={() => setSelectedTalent(null)}
            />
          )}
        </div>
      ) : (
        <button
          onClick={toggleAssistant}
          className="bg-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-800"
        >
          💬 Ask Lookk
        </button>
      )}
    </div>
  );
}
