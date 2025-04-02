import React from "react";

function getBadgeLabel(score) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "A−";
  if (score >= 60) return "B+";
  if (score >= 50) return "B";
  if (score >= 40) return "C";
  return "D";
}

function getBadgeColor(score) {
  if (score >= 90) return "bg-green-600 text-white";
  if (score >= 80) return "bg-green-500 text-white";
  if (score >= 70) return "bg-lime-400 text-black";
  if (score >= 60) return "bg-yellow-400 text-black";
  if (score >= 50) return "bg-orange-400 text-white";
  return "bg-red-500 text-white";
}

const MatchExplanationModal = ({ explanation, match_score, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Match Explanation</h2>

        {typeof match_score === "number" && (
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(
                match_score
              )}`}
            >
              Match Score: {match_score}% ({getBadgeLabel(match_score)})
            </span>
          </div>
        )}

        <p className="text-gray-700 whitespace-pre-wrap">{explanation}</p>
      </div>
    </div>
  );
};

export default MatchExplanationModal;
