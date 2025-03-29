import React, { useState } from "react";
import TalentResults from "./TalentResults";
import "@/common/styles/App.css";

function TalentFilter() {
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [results, setResults] = useState([]);

  const handleExecuteQuery = async () => {
    const filterData = {
      min_salary: minSalary ? parseFloat(minSalary) : 0,
      max_salary: maxSalary ? parseFloat(maxSalary) : null,
      required_skill: skills || null,
      job_title: jobTitle || null,
      job_description: jobDescription || null,
      location: location || null,
      availability: availability || null,
      work_mode: workMode || null,
      match_percentage: matchThreshold || 0,
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
    setLocation("");
    setAvailability("");
    setWorkMode("");
    setMatchThreshold(0);
    setResults([]);
    console.log("🔹 Filters cleared.");
  };

  return (
    <div className="talent-filter-container">
      <h2>Talent Filter</h2>
      <form>
        {/* Row 1: Salary & Skills */}
        <div className="filter-row">
          <div className="filter-field" style={{ width: "100%" }}>
            <label>Salary Range: ${minSalary || 0} – ${maxSalary || 200000}</label>
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={minSalary || 0}
              onChange={(e) => setMinSalary(e.target.value)}
            />
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={maxSalary || 200000}
              onChange={(e) => setMaxSalary(e.target.value)}
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

        {/* Row 2: Job Title & Description */}
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

        {/* Row 3: New Filters */}
        <div className="filter-row">
          <div className="filter-field">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Germany"
            />
          </div>
          <div className="filter-field">
            <label>Availability:</label>
            <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="">All</option>
              <option value="Immediate">Immediate</option>
              <option value="Two Weeks Notice">Two Weeks Notice</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
          <div className="filter-field">
            <label>Work Mode:</label>
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
              <option value="">All</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
          <div className="filter-field">
            <label>Match Threshold: {matchThreshold}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(Number(e.target.value))}
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
