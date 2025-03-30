import React from "react";
import "@/common/styles/App.css";

export default function MatchExplanationModal({ explanation, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animated-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>🧠 Why Andrew Picked This Talent</h3>
        <p>{explanation}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
