import React, { useState } from "react";
import TalentResults from "./TalentResults";
import Button from "@/components/common/Button";
import "@/common/styles/App.css";

function TalentFilter() {
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [results, setResults] = useState([]);

  const handleExecuteQuery = async () => {
    const normalizedJobTitle = jobTitle
      ? jobTitle.toLowerCase().replace(/[\s]+/g, ",")
      : null;

    const filterData = {
      required_skill: skills || null,
      job_title: normalizedJobTitle,
      job_description: jobDescription || null,
      match_percentage: matchThreshold || 0,
    };

    const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;
    console.log("Sending API Request with:", filterData);

    try {
      const response = await fetch(`${baseUrl}/talent-profiles`, {
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
    setSkills("");
    setJobTitle("");
    setJobDescription("");
    setMatchThreshold(0);
    setResults([]);
    console.log("🔹 Filters cleared.");
  };

  return (
    <div className="talent-filter-container">
      <h2 className="text-center text-primary text-2xl font-bold mb-6">Talent Filter</h2>
      <form className="filter-form">

        {/* Stack 1: Job Title and Skills */}
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

        {/* Stack 2: Job Description */}
        <div className="filter-column">
          <div className="filter-field">
            <label>Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. Develop REST APIs with Express and PostgreSQL"
              rows="4"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Stack 3: Match Threshold */}
        <div className="filter-column">
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

        {/* Stack 4: Buttons Centered */}
        {/* Stack 4: Buttons Centered */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={handleExecuteQuery}>
            Query for Talents
          </Button>
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>


      </form>

      {/* Results */}
      <TalentResults
        results={results}
        selectedLocations={[]} // always empty for now
        availabilityFilter={""}
        workModeFilter={""}
        matchThreshold={matchThreshold}
      />
    </div>
  );
}

export default TalentFilter;
