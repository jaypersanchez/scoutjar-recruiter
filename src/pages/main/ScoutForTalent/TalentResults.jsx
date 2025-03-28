// ✅ TalentResults.jsx (searchable multi-select location with full sort)
import React, { useState, useEffect } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";

function TalentResults({ results }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [filteredLocationOptions, setFilteredLocationOptions] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);

  const [filteredResults, setFilteredResults] = useState(results);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(80);
  const [matchResults, setMatchResults] = useState(null);

  const [selectedTalent, setSelectedTalent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const rowsPerPage = 15;

  useEffect(() => {
    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then(setJobs)
      .catch((err) => console.error("Failed to load jobs:", err));

    fetch("http://localhost:5000/locations/all")
      .then((res) => res.json())
      .then((data) => {
        setLocationOptions(data);
        setFilteredLocationOptions(data);
      })
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  useEffect(() => {
    let filtered = results.filter((profile) => {
      const matchesAvailability = availabilityFilter
        ? profile.availability?.toLowerCase() === availabilityFilter.toLowerCase()
        : false;
      const matchesWorkMode = workModeFilter
        ? profile.work_preferences?.work_mode?.toLowerCase() === workModeFilter.toLowerCase()
        : false;
      const matchesLocation = selectedLocations.length > 0
        ? selectedLocations.some((loc) => profile.location?.toLowerCase().includes(loc.toLowerCase()))
        : false;

      return (
        !availabilityFilter && !workModeFilter && selectedLocations.length === 0
          ? true
          : matchesAvailability || matchesWorkMode || matchesLocation
      );
    });

    setFilteredResults(filtered);
    setCurrentPage(0);
  }, [results, availabilityFilter, workModeFilter, selectedLocations]);

  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const currentResults = (matchResults || filteredResults).slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleMatch = async () => {
    if (!selectedJobId) {
      alert("Please select a job first.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/talent-profiles/match",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_id: selectedJobId,
            match_percentage: matchThreshold,
          }),
        }
      );

      const data = await response.json();
      setMatchResults(data);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error in advanced matching:", error);
      alert("Failed to apply advanced match.");
    }
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

  return (
    <div className="talent-results">
      <h3>Search Results</h3>

      <div className="drilldown-filters" style={{ marginBottom: "10px" }}>
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

        <div style={{ marginLeft: "20px", maxWidth: "300px" }}>
          <label>Location Search:</label>
          <input
            type="text"
            value={locationSearchInput}
            onChange={(e) => handleLocationSearch(e.target.value)}
            placeholder="Search cities..."
            style={{ width: "100%", marginBottom: "4px" }}
          />
          <div style={{ maxHeight: "120px", overflowY: "auto", border: "1px solid #ccc", padding: "4px" }}>
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
      </div>

      <div className="advanced-match" style={{ marginBottom: "15px" }}>
        <label>
          Match Against Job:
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="">Select a Job</option>
            {jobs.map((job) => (
              <option key={job.job_id} value={job.job_id}>
                {job.job_title}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          Match Threshold: {matchThreshold}%
          <input
            type="range"
            min="0"
            max="100"
            value={matchThreshold}
            onChange={(e) => setMatchThreshold(Number(e.target.value))}
            style={{ verticalAlign: "middle", marginLeft: "10px" }}
          />
        </label>

        <button style={{ marginLeft: "20px" }} onClick={handleMatch}>
          Apply Advanced Match
        </button>
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

      <div className="pagination" style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>

      {showDetailModal && selectedTalent && (
        <TalentDetailModal applicant={selectedTalent} onClose={handleCloseDetailModal} />
      )}
    </div>
  );
}

export default TalentResults;
