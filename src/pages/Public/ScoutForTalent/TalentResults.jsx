import React, { useState } from "react";
import "@/common/styles/App.css"; // Ensure the correct path to App.css

function TalentResults({ results }) {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 15;

  const totalPages = Math.ceil(results.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const currentResults = results.slice(startIndex, startIndex + rowsPerPage);

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
      <table className="results-table">
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Email</th>
            <th>Desired Salary</th>
            <th>Location</th>
            <th>Skills</th>
            <th>Work Mode</th>
          </tr>
        </thead>
        <tbody>
          {currentResults.map((profile) => (
            <tr key={profile.talent_id}>
              <td>{profile.talent_id}</td>
              <td>{profile.email}</td>
              <td>${profile.desired_salary}</td>
              <td>{profile.location}</td>
              <td>{profile.skills && profile.skills.join(", ")}</td>
              <td>
                {profile.work_preferences && profile.work_preferences.work_mode}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="pagination"
        style={{ marginTop: "10px", textAlign: "center" }}
      >
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
