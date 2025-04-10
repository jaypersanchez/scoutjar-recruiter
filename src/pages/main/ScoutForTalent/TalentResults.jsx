import React, { useState, useEffect } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";

function TalentResults({ results }) {
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

      <div className="drilldown-filters" style={{ marginBottom: "10px" }}>
        {/* Availability */}
        <label>
          Availability:
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Immediate">Immediate</option>
            <option value="Two Weeks Notice">Two Weeks Notice</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="Not Available">Not Available</option>
          </select>
        </label>

        {/* Work Mode */}
        <label style={{ marginLeft: "20px" }}>
          Work Mode:
          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </label>

        {/* Salary Range */}
        <div style={{ marginLeft: "20px", display: "inline-block" }}>
          <label>Min Salary:</label>
          <input
            type="number"
            value={minSalaryFilter}
            onChange={(e) => setMinSalaryFilter(e.target.value)}
            placeholder="e.g. 50000"
            style={{ width: "100px", marginLeft: "5px", marginRight: "10px" }}
          />
          <label>Max Salary:</label>
          <input
            type="number"
            value={maxSalaryFilter}
            onChange={(e) => setMaxSalaryFilter(e.target.value)}
            placeholder="e.g. 120000"
            style={{ width: "100px", marginLeft: "5px" }}
          />
        </div>

        {/* Location Search */}
        <div style={{ marginLeft: "20px", maxWidth: "300px", display: "inline-block", verticalAlign: "top" }}>
          <label>Location Search:</label>
          <input
            type="text"
            value={locationSearchInput}
            onChange={(e) => handleLocationSearch(e.target.value)}
            placeholder="Search cities..."
            style={{ width: "100%", marginBottom: "4px" }}
          />
          <div
            style={{
              maxHeight: "120px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "4px",
            }}
          >
            {filteredLocationOptions.map((opt, i) => (
              <label key={i} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={selectedLocations.includes(opt.value)}
                  onChange={() => toggleLocation(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <div style={{ marginLeft: "20px", marginTop: "25px", display: "inline-block" }}>
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>

      {/* Talent Table */}
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
              <td>{profile.email}</td>
              <td>${profile.desired_salary}</td>
              <td>{profile.location}</td>
              <td>{profile.skills && profile.skills.join(", ")}</td>
              <td>{profile.work_preferences?.work_mode}</td>
              <td>{profile.availability}</td>
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
