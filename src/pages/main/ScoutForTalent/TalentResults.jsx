import React, { useState, useEffect } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";

function TalentResults({ results }) {
  function getBadgeInfo(score) {
    const numericScore = Number(score);
    if (numericScore >= 90) return { badge: "A+", color: "#2e8b57", icon: "🚀" };
    if (numericScore >= 80) return { badge: "A", color: "#3cb371", icon: "🔥" };
    if (numericScore >= 70) return { badge: "A−", color: "#66cdaa", icon: "🏎️" };
    if (numericScore >= 60) return { badge: "B+", color: "#ffd700", icon: "💼" };
    if (numericScore >= 50) return { badge: "B", color: "#f0e68c", icon: "🔧" };
    if (numericScore >= 40) return { badge: "C", color: "#ffa07a", icon: "🧠" };
    return { badge: "D", color: "#a9a9a9", icon: "🐢" };
  }

  const [shortlistStatus, setShortlistStatus] = useState({});
  const [isShortlisting, setIsShortlisting] = useState({});
  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;

  const handleAiShortlist = async (talentId) => {
    const storedUser = sessionStorage.getItem("sso-login");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const recruiterId = user?.recruiter_id;

    if (!recruiterId) {
      setShortlistStatus((prev) => ({ ...prev, [talentId]: "Recruiter not logged in" }));
      return;
    }

    setIsShortlisting((prev) => ({ ...prev, [talentId]: true }));

    try {
      const response = await fetch(`${baseUrl}/ai-shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruiter_id: recruiterId, talent_id: talentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Shortlisting failed");
      }

      setShortlistStatus((prev) => ({ ...prev, [talentId]: "✅ Added to AI Shortlist" }));
    } catch (err) {
      setShortlistStatus((prev) => ({ ...prev, [talentId]: `❌ ${err.message}` }));
    } finally {
      setIsShortlisting((prev) => ({ ...prev, [talentId]: false }));
    }
  };

  return (
    <div className="talent-results">
      <h3>Search Results</h3>
      <table className="results-table">
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Full Name</th>
            <th>Desired Salary</th>
            <th>Location</th>
            <th>Skills</th>
            <th>Work Mode</th>
            <th>Availability</th>
            <th>Match Score</th>
            {/*<th>AI Shortlist</th>*/}
          </tr>
        </thead>
        <tbody>
          {results.map((profile) => (
            <tr
              key={profile.talent_id}
              onClick={() => setSelectedTalent(profile)}
              style={{ cursor: "pointer" }}
            >
              <td>{profile.talent_id}</td>
              <td>{profile.full_name}</td>
              <td>${profile.desired_salary}</td>
              <td>{profile.location}</td>
              <td>{profile.skills?.join(", ")}</td>
              <td>{profile.work_preferences?.work_mode}</td>
              <td>{profile.availability}</td>
              <td onClick={(e) => e.stopPropagation()}>
  {(() => {
    const { badge, color, icon } = getBadgeInfo(profile.match_score);
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color, fontWeight: "bold" }}>
            {icon} {profile.match_score}% <small>({badge})</small>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAiShortlist(profile.talent_id);
            }}
            disabled={isShortlisting[profile.talent_id]}
            style={{
              fontSize: "11px",
              backgroundColor: "#4c51bf",
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {isShortlisting[profile.talent_id] ? "..." : "📌"}
          </button>
        </div>
        <small>{profile.explanation}</small>
        {shortlistStatus[profile.talent_id] && (
          <div style={{ fontSize: "11px", color: "#4c51bf", marginTop: "2px" }}>
            {shortlistStatus[profile.talent_id]}
          </div>
        )}
      </>
    );
  })()}
</td>

              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TalentResults;