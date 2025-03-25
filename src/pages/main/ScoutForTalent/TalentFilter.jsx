import React, { useState } from "react";
import TalentResults from "./TalentResults";
import "@/common/styles/App.css";

function TalentFilter() {
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState([]);

  const handleExecuteQuery = async () => {
    const filterData = {
      min_salary: minSalary ? parseFloat(minSalary) : 0,
      max_salary: maxSalary ? parseFloat(maxSalary) : null,
      required_skill: skills || null,
      job_title: jobTitle || null,
      job_description: jobDescription || null,
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

  const handleClearFilters = () => {
    setMinSalary("");
    setMaxSalary("");
    setSkills("");
    setJobTitle("");
    setJobDescription("");
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
            <label>Required Skill:</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript"
            />
          </div>
        </div>

        {/* Row 2: Job Title */}
        <div className="filter-row">
          <div className="filter-field">
            <label>Job Title:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Backend Engineer"
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
              placeholder="e.g. Develop REST APIs with Express and PostgreSQL"
              rows="4"
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

      <TalentResults results={results} />
    </div>
  );
}

export default TalentFilter;
