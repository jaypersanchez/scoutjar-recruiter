// TalentFilter.jsx
import React, { useState } from "react";
import TalentResults from "./TalentResults";
import "@/common/styles/App.css"; // Ensure the correct path to your App.css

function TalentFilter() {
  // Local state for filter fields
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchPercentage, setMatchPercentage] = useState(50); // Default set to 50%
  // State to hold search results
  const [results, setResults] = useState([]);

  // Function to execute the query using filters
  const handleExecuteQuery = async () => {
    // Build the request body matching your API specification
    const filterData = {
      min_salary: minSalary ? parseFloat(minSalary) : 0,
      max_salary: maxSalary ? parseFloat(maxSalary) : null,
      filter_location: location || null,
      required_skill: skills || null,
      job_title: jobTitle || null,
      preferred_work_mode: workMode || null,
      job_description: jobDescription || null,
      match_percentage: matchPercentage,
    };

    console.log("Sending API Request with:", filterData);

    try {
      const response = await fetch("http://localhost:5000/talent-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterData),
      });

      const data = await response.json();
      console.log("API Response Received:", data);
      setResults(data || []);
    } catch (error) {
      console.error("Error executing query:", error);
      alert("Error executing query.");
    }
  };

  // Function to reset filter fields
  const handleClearFilters = () => {
    setMinSalary("");
    setMaxSalary("");
    setLocation("");
    setSkills("");
    setJobTitle("");
    setWorkMode("");
    setJobDescription("");
    setMatchPercentage(50);
    setResults([]);
    console.log("🔹 Filters cleared.");
  };

  return (
    <div className="talent-filter-container">
      <h2>Talent Filter</h2>
      <form>
        {/* Row 1: Basic Filters */}
        <div className="filter-row">
          <div className="filter-field">
            <label>Minimum Salary:</label>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <div className="filter-field">
            <label>Maximum Salary:</label>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              placeholder="e.g. 100000"
            />
          </div>
          <div className="filter-field">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. san fran"
            />
          </div>
          <div className="filter-field">
            <label>Required Skill:</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. java"
            />
          </div>
        </div>
        {/* Row 2: Job Title and Preferred Work Mode */}
        <div className="filter-row">
          <div className="filter-field">
            <label>Job Title:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. user"
            />
          </div>
          <div className="filter-field">
            <label>Preferred Work Mode:</label>
            <input
              type="text"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              placeholder="e.g. ons"
            />
          </div>
        </div>
        {/* Row 3: Job Description */}
        <div className="filter-row">
          <div className="filter-field" style={{ width: "100%" }}>
            <label>Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. user"
              rows="4"
            />
          </div>
        </div>
        {/* Row 4: Match Percentage Slider */}
        <div className="filter-row">
          <div className="filter-field" style={{ width: "100%" }}>
            <label>Match Percentage: {matchPercentage}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={matchPercentage}
              onChange={(e) => setMatchPercentage(e.target.value)}
            />
          </div>
        </div>
      </form>
      <div className="filter-buttons">
        <button type="button" onClick={handleExecuteQuery}>
          Query for Talents
        </button>
        <button type="button" onClick={handleClearFilters} className="clear-button">
          Clear Filters
        </button>
      </div>
      {/* Display the results below the filter form */}
      <TalentResults results={results} />
    </div>
  );
}

export default TalentFilter;
