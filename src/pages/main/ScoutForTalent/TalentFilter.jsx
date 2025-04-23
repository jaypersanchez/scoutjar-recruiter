import React, { useState, useEffect } from "react";
import TalentResults from "./TalentResults";
import Button from "@/components/common/Button";
import "@/common/styles/App.css";

function TalentFilter() {
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [results, setResults] = useState([]);
  const [industryExperience, setIndustryExperience] = useState("");
  const [yearsExperience, setYearsExperience] = useState(0);
  const [loading, setLoading] = useState(false);

  
  const handleExecuteQuery = async () => {
    const normalizedJobTitle = jobTitle
      ? jobTitle.toLowerCase().replace(/[\s]+/g, ",")
      : null;

    const filterData = {
      required_skill: skills || null,
      job_title: normalizedJobTitle,
      job_description: jobDescription || null,
      match_percentage: matchThreshold || 0,
      industry_experience: industryExperience || null,
      years_experience: yearsExperience || 0,
    };

    const baseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}`;
    console.log("Sending API Request with:", filterData);

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // match Flask timeout

      const response = await fetch(`${baseUrl}/ai-match-talents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterData),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await response.json();
      console.log("API Response Received:", data);
      setResults(data.matches || []);

      const transformed = (data.matches || []).map((item) => ({
        talent_id: item.talent_id,
        full_name: item.name || item.full_name || "N/A",
        email: item.email || "n/a@example.com",
        desired_salary: parseFloat(item.desired_salary) || 0,
        location: item.location || "Unknown",
        skills: Array.isArray(item.skills) ? item.skills : [],
        work_preferences: typeof item.work_preferences === "object" ? item.work_preferences : {},
        availability: item.availability || "Unknown",
        match_score: parseFloat(item.match_score) || 0,
        explanation: item.explanation || "No explanation provided.",
        bio: item.bio || "",
        experience: item.experience || "",
        education: item.education || "",
        years_experience: parseFloat(item.years_experience) || 0,
        resume: item.resume || "",
      }));
      

      setResults(transformed);
      
    } catch (error) {
      console.error("Error executing query:", error);
      alert("Error executing query. This may take time due to AI processing.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSkills("");
    setJobTitle("");
    setJobDescription("");
    setMatchThreshold(0);
    setIndustryExperience("");
    setYearsExperience(0);
    setResults([]);
    console.log("🔹 Filters cleared.");
  };

  return (
    <div className="talent-filter-container">
      <h2 className="text-center text-primary text-2xl font-bold mb-6">Talent Filter</h2>
      <form className="filter-form">
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

        <div className="filter-column">
          <div className="filter-field">
            <label>Required Experience:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. Develop REST APIs with Express and PostgreSQL"
              rows="4"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-field">
            <label>Industry Experience:</label>
            <input
              type="text"
              value={industryExperience}
              onChange={(e) => setIndustryExperience(e.target.value)}
              placeholder="e.g. IT, Finance"
            />
          </div>
          <div className="filter-field">
            <label>Years of Experience:</label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              value={yearsExperience === 0 ? "" : yearsExperience}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                setYearsExperience(isNaN(parsed) ? 0 : parsed);
              }}
              placeholder="e.g. 3"
            />
          </div>
        </div>

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

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={handleExecuteQuery}>Query for Talents</Button>
          <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </form>

      {loading && (
        <div className="text-center mt-6">
          <p className="text-primary font-medium">⏳ Matching talents... Please wait, this may take up to 2 minutes.</p>
        </div>
      )}

      <TalentResults
        results={results}
        selectedLocations={[]}
        availabilityFilter={""}
        workModeFilter={""}
        matchThreshold={matchThreshold}
      />
    </div>
  );
}

export default TalentFilter;
