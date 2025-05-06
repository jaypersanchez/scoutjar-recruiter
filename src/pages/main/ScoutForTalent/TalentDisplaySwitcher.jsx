import React, { useState } from "react";
import TalentResults from "./TalentResults";
import TalentManagerView from "./TalentManagerView";

function TalentDisplaySwitcher({ results, jobTitle, jobDescription, requiredSkills }) {
  const [viewMode, setViewMode] = useState("results"); // 'results' or 'manager'

  return (
    <div>
      {/* Toggle Buttons */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => setViewMode("results")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: viewMode === "results" ? "#4c51bf" : "#e2e8f0",
            color: viewMode === "results" ? "white" : "#2d3748",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Profile View
        </button>
        <button
          onClick={() => setViewMode("manager")}
          style={{
            padding: "10px 20px",
            backgroundColor: viewMode === "manager" ? "#4c51bf" : "#e2e8f0",
            color: viewMode === "manager" ? "white" : "#2d3748",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Table View
        </button>
      </div>

      {/* Render View Conditionally */}
      {viewMode === "results" && (
        <TalentResults
          results={results}
          jobTitle={jobTitle}
          jobDescription={jobDescription}
          requiredSkills={requiredSkills}
        />
      )}

      {viewMode === "manager" && (
        <TalentManagerView results={results} />
      )}
    </div>
  );
}

export default TalentDisplaySwitcher;
