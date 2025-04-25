import React, { useState, useEffect } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";

function getBadgeInfo(score) {
  const numericScore = Number(score);
  if (numericScore >= 90) return { badge: "A+", color: "#2e8b57", icon: "🚀" };
  if (numericScore >= 80) return { badge: "A", color: "#3cb371", icon: "🔥" };
  if (numericScore >= 70) return { badge: "A−", color: "#66cdaa", icon: "🏎️" };
  if (numericScore >= 60) return { badge: "B+", color: "#ffd700", icon: "💼" };
  if (numericScore >= 50) return { badge: "B", color: "#f0e68c", icon: "🔧" };
  if (numericScore >= 40) return { badge: "C", color: "#ffa07a", icon: "🧐" };
  return { badge: "D", color: "#a9a9a9", icon: "🐢" };
}

function TalentResults({ results }) {
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [filteredResults, setFilteredResults] = useState(results);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [shortlistStatus, setShortlistStatus] = useState({});
  const [isShortlisting, setIsShortlisting] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 15;

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;
  const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}`;
  useEffect(() => {
    fetch(`${baseUrl}/locations/all`)
      .then((res) => res.json())
      .then(setLocationOptions)
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  useEffect(() => {
    const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, " ").trim();

    const filtered = results.filter((profile) => {
      const location = normalize(profile.location);

      const matchesLocation =
        selectedLocations.length === 0
          ? true
          : selectedLocations.some((selected) => {
              const sel = normalize(selected);
              return location.includes(sel) || sel.includes(location);
            });

      const matchesAvailability = availabilityFilter
        ? normalize(profile.availability) === normalize(availabilityFilter)
        : true;

      const matchesWorkMode = workModeFilter
        ? normalize(profile.work_preferences?.work_mode) === normalize(workModeFilter)
        : true;

      return matchesLocation && matchesAvailability && matchesWorkMode;
    });

    setFilteredResults(filtered);
    setCurrentPage(0);
  }, [results, selectedLocations, availabilityFilter, workModeFilter]);

  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const currentResults = filteredResults.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  const handleRowClick = (profile) => setSelectedTalent(profile);
  const handleCloseDetailModal = () => setSelectedTalent(null);

  const toggleLocation = (value) => {
    setSelectedLocations((prev) =>
      prev.includes(value)
        ? prev.filter((loc) => loc !== value)
        : [...prev, value]
    );
  };

  const handleAiShortlist = async (talentId) => {
    const storedUser = sessionStorage.getItem("sso-login");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const recruiterId = user?.recruiter_id;

    if (!recruiterId) {
      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: "Recruiter not logged in",
      }));
      return;
    }

    setIsShortlisting((prev) => ({ ...prev, [talentId]: true }));

    try {
      const response = await fetch(`${AIbaseUrl}/ai-shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruiter_id: recruiterId, talent_id: talentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Shortlisting failed");
      }

      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: "✅ Added to AI Shortlist",
      }));
    } catch (err) {
      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: `❌ ${err.message}`,
      }));
    } finally {
      setIsShortlisting((prev) => ({ ...prev, [talentId]: false }));
    }
  };

  return (
    <div className="talent-results">
      <h3>Search Results</h3>

      <div className="filter-form">
        <div className="filter-row">
          <div className="filter-column filter-field" style={{ flex: 1 }}>
            <label>Location</label>
            <input
              type="text"
              value={locationSearchInput}
              onChange={(e) => setLocationSearchInput(e.target.value)}
              placeholder="Search city/country..."
              className="login-input"
            />
            <div className="scrollable-options" style={{ maxHeight: "150px", overflowY: "scroll", border: "1px solid #ccc", marginTop: "5px", padding: "5px" }}>
              {locationOptions
                .filter((loc) =>
                  loc.label.toLowerCase().includes(locationSearchInput.toLowerCase())
                )
                .map((loc, idx) => (
                  <label key={idx} style={{ display: "block", marginBottom: "3px" }}>
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc.value)}
                      onChange={() => toggleLocation(loc.value)}
                      style={{ marginRight: "8px" }}
                    />
                    {loc.label}
                  </label>
                ))}
            </div>
          </div>

          <div className="filter-column filter-field">
            <label>Availability</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="login-input"
            >
              <option value="">All</option>
              <option value="Immediate">Immediate</option>
              <option value="Two Weeks Notice">Two Weeks Notice</option>
              <option value="1 Month">1 Month</option>
              <option value="2 Months">2 Months</option>
              <option value="3 Months">3 Months</option>  
            </select>
          </div>

          <div className="filter-column filter-field">
            <label>Work Mode</label>
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="login-input"
            >
              <option value="">All</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      <table className="results-table">
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Desired Salary</th>
            <th>Location</th>
            <th>Skills</th>
            <th>Work Mode</th>
            <th>Availability</th>
            <th>Match Score</th>
          </tr>
        </thead>
        <tbody>
          {currentResults.map((profile) => {
            const { badge, color, icon } = getBadgeInfo(profile.match_score);
            return (
              <tr
                key={profile.talent_id}
                onClick={() => handleRowClick(profile)}
                style={{ cursor: "pointer" }}
              >
                <td>{profile.talent_id}</td>
                <td>{profile.full_name}</td>
                <td>{profile.email}</td>
                <td>${profile.desired_salary}</td>
                <td>{profile.location}</td>
                <td>{profile.skills?.join(", ")}</td>
                <td>{profile.work_preferences?.work_mode}</td>
                <td>{profile.availability}</td>
                <td onClick={(e) => e.stopPropagation()}>
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination" style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={handlePrevious} disabled={currentPage === 0}>Previous</button>
        <span style={{ margin: "0 10px" }}>Page {currentPage + 1} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage >= totalPages - 1}>Next</button>
      </div>

      {selectedTalent && (
        <TalentDetailModal
          applicant={selectedTalent}
          onClose={handleCloseDetailModal}
          showShortlist={false}
        />
      )}
    </div>
  );
}

export default TalentResults;
