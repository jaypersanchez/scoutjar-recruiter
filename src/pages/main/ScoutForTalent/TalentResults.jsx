import React from "react";
import { useState, useEffect } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";
import BadgeAplus from "../../../assets/images/badges/aplus.png";
import BadgeA from "../../../assets/images/badges/a.png";
import BadgeBplus from "../../../assets/images/badges/bplus.png";
import BadgeB from "../../../assets/images/badges/b.png";
import BadgeC from "../../../assets/images/badges/c.png";
import BadgeD from "../../../assets/images/badges/d.png";

/*function getBadgeInfo(score) {
  const numericScore = Number(score);
  if (numericScore >= 90) return { badge: "A+", color: "#2e8b57", icon: "🚀" };
  if (numericScore >= 70) return { badge: "A", color: "#3cb371", icon: "🔥" };
  if (numericScore >= 50) return { badge: "A−", color: "#66cdaa", icon: "🏎️" };
  if (numericScore >= 30) return { badge: "B+", color: "#ffd700", icon: "💼" };
  if (numericScore >= 20) return { badge: "B", color: "#f0e68c", icon: "🔧" };
  if (numericScore >= 15) return { badge: "C", color: "#ffa07a", icon: "🧐" };
  return { badge: "D", color: "#a9a9a9", icon: "🐢" };
}*/

function getBadgeInfo(score) {
  const numericScore = Number(score);
  if (numericScore >= 90) return { badge: "A+", image: BadgeAplus };
  if (numericScore >= 70) return { badge: "A", image: BadgeA };
  if (numericScore >= 50) return { badge: "A−", image:BadgeAplus };
  if (numericScore >= 30) return { badge: "B+", image:BadgeB };
  if (numericScore >= 20) return { badge: "B", image:BadgeC };
  if (numericScore >= 15) return { badge: "C", image:BadgeD };
  return { badge: "D", image:BadgeD };
}

function TalentResults({ results, jobTitle, jobDescription, requiredSkills }) {
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [shortlistStatus, setShortlistStatus] = useState({});
  const [isShortlisting, setIsShortlisting] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [messageTalent, setMessageTalent] = useState(null);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");


  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;
  const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}`;

  const rowsPerPage = 15;

  /*useEffect(() => {
    fetch(`${baseUrl}/locations/all`)
      .then((res) => res.json())
      .then(setLocationOptions)
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);*/

    useEffect(() => {
  fetch(`${baseUrl}/locations/all`)
    .then((res) => res.json())
    .then((originalLocations) => {
      const augmented = originalLocations.flatMap(loc => {
        const extras = [];

        const label = loc.label || "";
        const value = loc.value || loc.label;

        if (label.includes("United Kingdom")) {
          const baseLabel = label.replace("United Kingdom", "").trim().replace(/,$/, "");

          extras.push({
            ...loc,
            label: `${baseLabel}, UK`,
            value: `${baseLabel}, UK`
          });

          extras.push({
            ...loc,
            label: `${baseLabel}, Britain`,
            value: `${baseLabel}, Britain`
          });
        }

        return [{ ...loc, label, value }, ...extras];
      });

      setLocationOptions(augmented);
    })
    .catch((err) => console.error("Failed to load locations:", err));
}, []);




  const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, " ").trim();

  const filteredResults = results.filter((profile) => {
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

      const salary = Number(profile.desired_salary || 0);
      const currency = profile.currency || "USD";

      const matchesSalary =
        (!minSalary || salary >= Number(minSalary)) &&
        (!maxSalary || salary <= Number(maxSalary));

      const matchesCurrency = selectedCurrency ? currency === selectedCurrency : true;


    //return matchesLocation && matchesAvailability && matchesWorkMode;
    return (
      matchesLocation &&
      matchesAvailability &&
      matchesWorkMode &&
      matchesSalary &&
      matchesCurrency
    );

  });

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

      {/* Filters */}
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

          {/** Currency section */}
          <div className="filter-column filter-field">
            <label>Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="login-input"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ILS">ILS</option>
            </select>
          </div>

          <div className="filter-column filter-field">
            <label>Min Salary</label>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="login-input"
              placeholder="e.g., 1000"
            />
          </div>

          <div className="filter-column filter-field">
            <label>Max Salary</label>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="login-input"
              placeholder="e.g., 3000"
            />
          </div>

        </div>
      </div>

      {/* Talent List */}
      <div className="results-list" style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        minHeight: "400px",
        justifyContent: currentResults.length === 0 ? "center" : "flex-start",
        alignItems: "center"
      }}>
        {currentResults.length > 0 ? (
          currentResults.map((profile) => {
            const { badge, image } = getBadgeInfo(profile.match_score);
            return (
              <div
                key={profile.talent_id}
                /*onClick={() => handleRowClick(profile)}*/
                onClick={() => {
                  if (profile.profile_mode === "passive" || !profile.profile_mode) {
                    setMessageTalent(profile);  // new state
                  } else {
                    handleRowClick(profile);
                  }
                }}

                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  backgroundColor: "#f9fafb",
                  cursor: "pointer",
                  width: "100%",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#edf2f7"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
              >
                <div style={{ flex: 1 }}>

                  {/*<div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#2d3748" }}>
                    #{profile.talent_id} - {profile.full_name}
                  </div>*/}
                  {profile.profile_mode === "passive" || !profile.profile_mode ? (
                    <>
                      <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#2d3748" }}>
                        #{profile.talent_id} - {profile.full_name}
                      </div>
                      <div style={{ fontSize: "1rem", color: "#4a5568", marginTop: "6px" }}>
                        ⭐ This candidate is highly sought after.
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#2d3748" }}>
                        #{profile.talent_id} - {profile.full_name} - {profile.profile_mode}
                      </div>
                      <div style={{ fontSize: "1rem", color: "#4a5568", marginTop: "6px" }}>
                        {profile.email}
                      </div>
                      <div style={{ fontSize: "1rem", color: "#4a5568", marginTop: "6px" }}>
                        📍 {profile.location} | 🛠️ {profile.skills?.join(", ") || "No Skills"} | 🏢 {profile.work_preferences?.work_mode}
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "#718096", marginTop: "6px" }}>
                        Availability: {profile.availability || "N/A"}
                      </div>
                    </>
                  )}

                  {/*<div style={{ fontSize: "1rem", color: "#4a5568", marginTop: "6px" }}>
                    {profile.email}
                  </div>
                  <div style={{ fontSize: "1rem", color: "#4a5568", marginTop: "6px" }}>
                    📍 {profile.location} | 🛠️ {profile.skills?.join(", ") || "No Skills"} | 🏢 {profile.work_preferences?.work_mode}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "#718096", marginTop: "6px" }}>
                    Availability: {profile.availability || "N/A"}
                  </div>*/}
                  {/*{profile.explanation && (
                    <div style={{ fontSize: "1.0rem", fontWeight: "bold",color: "#2d3748", marginTop: "8px" }}>
                      {profile.explanation}
                    </div>
                  )}*/}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", minWidth: "150px" }}>
                  <div style={{
                   fontWeight: "900",
                    fontSize: "1.3rem",
                    padding: "8px 14px",
                    borderRadius: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#edf2f7", // subtle gray
                    color: "#2d3748" // strong readable text
                  }}>
                    <img
                      src={image}
                      alt={badge}
                      style={{ width: "28px", height: "28px", objectFit: "contain" }}
                    />

                    {Math.round(profile.match_score)}%
                    {/*<small style={{ fontSize: "0.8rem", marginLeft: "4px" }}>({badge})</small>*/}
                  </div>

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
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {isShortlisting[profile.talent_id] ? "..." : "📌 Shortlist"}
                  </button>

                  {shortlistStatus[profile.talent_id] && (
                    <div style={{ fontSize: "10px", color: "#4c51bf" }}>
                      {shortlistStatus[profile.talent_id]}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", color: "#718096", fontSize: "1.2rem" }}>
            No matching talents found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination" style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={handlePrevious} disabled={currentPage === 0}>Previous</button>
        <span style={{ margin: "0 10px" }}>Page {currentPage + 1} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage >= totalPages - 1}>Next</button>
      </div>

      {/* Modal */}
      {selectedTalent && (
        <TalentDetailModal
          applicant={selectedTalent}
          onClose={handleCloseDetailModal}
          showShortlist={false}
          jobTitle={jobTitle}
          jobDescription={jobDescription}
          requiredSkills={requiredSkills}
        />
      )}
    </div>
  );
}

export default TalentResults;
