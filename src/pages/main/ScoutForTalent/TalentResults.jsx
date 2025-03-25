import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";

function TalentResults({ results }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [filteredResults, setFilteredResults] = useState(results);

  const rowsPerPage = 15;

  useEffect(() => {
    // Apply drill-down filters to the result set
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
    setCurrentPage(0); // reset to page 1 on filter change
  }, [results, availabilityFilter, workModeFilter]);

  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const currentResults = filteredResults.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  if (!results || results.length === 0) {
    return (
      <div className="talent-results">
        <p>No results found.</p>
      </div>
    );
  }

  return (
    <div className="talent-results">
      <h3>Search Results</h3>

      {/* 🔽 Drill-down Filter Controls */}
      <div className="drilldown-filters" style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>
          Availability:
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            style={{ marginLeft: "5px" }}
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
            style={{ marginLeft: "5px" }}
          >
            <option value="">All</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </label>
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
              <td>
                {profile.work_preferences && profile.work_preferences.work_mode}
              </td>
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
