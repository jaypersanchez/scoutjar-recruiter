import React, { useState } from "react";

export default function AndrewAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleAssistant = () => setIsOpen(!isOpen);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/search-talents", {
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
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-lg w-[400px] h-[500px] p-4 border border-gray-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Ask Andrew 🤖</h2>
            <button onClick={toggleAssistant} className="text-gray-500">✖</button>
          </div>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Ask Andrew to find talents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="mt-2 w-full bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Talent"}
          </button>

          <div className="mt-4 space-y-3">
            {results.map((talent) => (
              <div key={talent.talent_id} className="border rounded p-2 text-sm">
                <div className="font-medium">{talent.name}</div>
                <div className="text-xs text-gray-500">{talent.location} • {talent.availability}</div>
                <div className="text-xs mt-1 text-gray-700">
                  <strong>Skills:</strong> {(talent.skills || []).join(", ")}
                </div>
                <div className="text-xs mt-1 italic text-gray-600 whitespace-pre-wrap">
                  {talent.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={toggleAssistant}
          className="bg-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-800"
        >
          💬 Ask Andrew
        </button>
      )}
    </div>
  );
}
