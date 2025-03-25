import React, { useState, useEffect } from "react";

function TalentResults({ results }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [filteredResults, setFilteredResults] = useState(results);

  const [jobs, setJobs] = useState([]);               // 🆕 List of jobs from backend
  const [selectedJobId, setSelectedJobId] = useState(""); // 🆕 Selected job ID
  const [matchThreshold, setMatchThreshold] = useState(80); // 🆕 Default 80%
  const [matchResults, setMatchResults] = useState(null); // 🆕 Result after match

  const rowsPerPage = 15;

  // 🆕 Load jobs list for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/jobs")
      .then(res => res.json())
      .then(setJobs)
      .catch(err => console.error("Failed to load jobs:", err));
  }, []);

  // 🔁 Apply drill-down filters client-side
  useEffect(() => {
    let filtered = results;

    if (availabilityFilter) {
      filtered = filtered.filter((profile) =>
        profile.availability &&
        profile.availability.toLowerCase() === availabilityFilter.toLowerCase()
      );
    }

    if (workModeFilter) {
      filtered = filtered.filter((profile) =>
        profile.work_preferences &&
        profile.work_preferences.work_mode &&
        profile.work_preferences.work_mode.toLowerCase() === workModeFilter.toLowerCase()
      );
    }

    setFilteredResults(filtered);
    setCurrentPage(0);
  }, [results, availabilityFilter, workModeFilter]);

  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const currentResults = (matchResults || filteredResults).slice(startIndex, startIndex + rowsPerPage);

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
      const response = await fetch("http://localhost:5000/talent-profiles/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: selectedJobId,
          match_percentage: matchThreshold,
        }),
      });

      const data = await response.json();
      setMatchResults(data);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error in advanced matching:", error);
      alert("Failed to apply advanced match.");
    }
  };

  return (
    <div className="talent-results">
      <h3>Search Results</h3>

      {/* 🔽 Drill-down Filter Controls */}
      <div className="drilldown-filters" style={{ marginBottom: "10px" }}>
        <label>
          Availability:
          <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
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
          <select value={workModeFilter} onChange={(e) => setWorkModeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </label>
      </div>

      {/* 🎯 Advanced Matching */}
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

      {/* 📄 Results Table */}
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
            <tr key={profile.talent_id}>
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

      {/* 🔄 Pagination */}
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
    </div>
  );
}

export default TalentResults;
