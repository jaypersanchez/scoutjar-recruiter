export default function MatchExplanationModal({ explanation, loading, onClose }) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content animated-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>🧠 Why Andrew Picked This Talent</h3>
          {loading ? (
            <div className="loading-spinner">⏳ Fetching explanation...</div>
          ) : (
            <p>{explanation}</p>
          )}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  