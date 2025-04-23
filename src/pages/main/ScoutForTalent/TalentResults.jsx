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
  
  const [currentPage, setCurrentPage] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [minSalaryFilter, setMinSalaryFilter] = useState("");
  const [maxSalaryFilter, setMaxSalaryFilter] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [filteredLocationOptions, setFilteredLocationOptions] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredResults, setFilteredResults] = useState(results);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;
  const rowsPerPage = 15;

  useEffect(() => {
    fetch(`${baseUrl}/locations/all`)
      .then((res) => res.json())
      .then((data) => {
        setLocationOptions(data);
        setFilteredLocationOptions(data);
      })
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  useEffect(() => {
    const normalize = (str) =>
      (str || "")
        .toLowerCase()
        .replace("null,", "")
        .replace(", null", "")
        .replace(/\s+/g, " ")
        .trim();

    const filtered = results.filter((profile) => {
      const normalizedLocation = normalize(profile.location);

      const matchesAvailability = availabilityFilter
        ? profile.availability?.toLowerCase() === availabilityFilter.toLowerCase()
        : true;

      const matchesWorkMode = workModeFilter
        ? profile.work_preferences?.work_mode?.toLowerCase() === workModeFilter.toLowerCase()
        : true;

      const matchesLocation = selectedLocations.length > 0
        ? selectedLocations.some((loc) => {
            const locParts = normalize(loc).split(/[,\s]+/);
            return locParts.some((part) => normalizedLocation.includes(part));
          })
        : true;

      const salary = profile.desired_salary || 0;
      const matchesMinSalary = minSalaryFilter ? salary >= parseFloat(minSalaryFilter) : true;
      const matchesMaxSalary = maxSalaryFilter ? salary <= parseFloat(maxSalaryFilter) : true;

      return matchesAvailability && matchesWorkMode && matchesLocation && matchesMinSalary && matchesMaxSalary;
    });

    setFilteredResults(filtered);
    setCurrentPage(0);
  }, [results, availabilityFilter, workModeFilter, selectedLocations, minSalaryFilter, maxSalaryFilter]);

  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const currentResults = filteredResults.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleRowClick = (profile) => {
    setSelectedTalent(profile);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedTalent(null);
    setShowDetailModal(false);
  };

  const toggleLocation = (locationValue) => {
    setSelectedLocations((prev) =>
      prev.includes(locationValue)
        ? prev.filter((loc) => loc !== locationValue)
        : [...prev, locationValue]
    );
  };

  const handleLocationSearch = (input) => {
    setLocationSearchInput(input);
    const lowerInput = input.toLowerCase();
    const filtered = locationOptions.filter((loc) =>
      loc.label.toLowerCase().includes(lowerInput)
    );
    setFilteredLocationOptions(filtered);
  };

  const handleClearFilters = () => {
    setAvailabilityFilter("");
    setWorkModeFilter("");
    setSelectedLocations([]);
    setLocationSearchInput("");
    setFilteredLocationOptions(locationOptions);
    setMinSalaryFilter("");
    setMaxSalaryFilter("");
  };

  return (
    <div className="talent-results">
      <h3>Search Results</h3>

      <div className="drilldown-filters" style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
  {/* Availability */}
  <div>
    <label>Availability:</label>
    <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
      <option value="">Any</option>
      <option value="Immediate">Immediately</option>
      <option value="Two Weeks Notice">1 Week</option>
      <option value="2 Weeks">2 Weeks</option>
      <option value="1 Month">1 Month</option>
      <option value="3 Months">3 Months</option>
    </select>
  </div>

  {/* Work Mode */}
  <div>
    <label>Work Mode:</label>
    <select value={workModeFilter} onChange={(e) => setWorkModeFilter(e.target.value)}>
      <option value="">Any</option>
      <option value="Remote">Remote</option>
      <option value="Onsite">Onsite</option>
      <option value="Hybrid">Hybrid</option>
    </select>
  </div>

  {/* Min Salary */}
  <div>
    <label>Min Salary:</label>
    <input
      type="number"
      value={minSalaryFilter}
      onChange={(e) => setMinSalaryFilter(e.target.value)}
      placeholder="e.g. 1000"
    />
  </div>

  {/* Max Salary */}
  <div>
    <label>Max Salary:</label>
    <input
      type="number"
      value={maxSalaryFilter}
      onChange={(e) => setMaxSalaryFilter(e.target.value)}
      placeholder="e.g. 5000"
    />
  </div>

  {/* Location Search */}
  <div style={{ flexBasis: "100%" }}>
    <label>Search Locations:</label>
    <input
      type="text"
      value={locationSearchInput}
      onChange={(e) => handleLocationSearch(e.target.value)}
      placeholder="Type to search..."
    />
    <div style={{ maxHeight: "120px", overflowY: "scroll", border: "1px solid #ccc", padding: "0.5rem" }}>
      {filteredLocationOptions.map((loc) => (
        <div key={loc.label}>
          <label>
            <input
              type="checkbox"
              checked={selectedLocations.includes(loc.label)}
              onChange={() => toggleLocation(loc.label)}
            />
            {loc.label}
          </label>
        </div>
      ))}
    </div>
  </div>

  {/* Clear Filters */}
  <div>
    <button type="button" onClick={handleClearFilters}>
      Clear Filters
    </button>
  </div>
</div>


      {/* Talent Table */}
      <table className="results-table">
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Full Name</th>
            {/*<th>Email</th>*/}
            <th>Desired Salary</th>
            <th>Location</th>
            <th>Skills</th>
            <th>Work Mode</th>
            <th>Availability</th>
            <th>Match Score</th>
          </tr>
        </thead>
        <tbody>
          {currentResults.map((profile) => (
            <tr
              key={profile.talent_id}
              onClick={() => handleRowClick(profile)}
              style={{ cursor: "pointer" }}
            >
              <td>{profile.talent_id}</td>
              <td>{profile.full_name}</td>
              {/*<td>{profile.email}</td>*/}
              <td>${profile.desired_salary}</td>
              <td>{profile.location}</td>
              <td>{profile.skills && profile.skills.join(", ")}</td>
              <td>{profile.work_preferences?.work_mode}</td>
              <td>{profile.availability}</td>
              <td>
  {(() => {
    const { badge, color, icon } = getBadgeInfo(profile.match_score);
    return (
      <>
        <span style={{ color, fontWeight: "bold" }}>
          {icon} {profile.match_score}% <small>({badge})</small>
        </span>
        <br />
        <small>{profile.explanation}</small>
      </>
    );
  })()}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination" style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage >= totalPages - 1}>
          Next
        </button>
      </div>

      {/* Talent Detail Modal */}
      {showDetailModal && selectedTalent && (
        <TalentDetailModal
          applicant={selectedTalent}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
}

export default TalentResults;