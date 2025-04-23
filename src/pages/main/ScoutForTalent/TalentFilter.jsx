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
  const [jobTitles, setJobTitles] = useState([]);
  const [suggestingSkills, setSuggestingSkills] = useState(false);

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}/job-titles/all`);
        const data = await response.json();
        setJobTitles(data || []);
      } catch (err) {
        console.error("Failed to fetch job titles:", err);
      }
    };
    fetchJobTitles();
  }, []);

  const handleSuggestSkills = async () => {
    setSuggestingSkills(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}/suggest-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_title: jobTitle, job_description: jobDescription }),
      });
      const data = await response.json();
      if (data.suggested_skills) {
        setSkills(data.suggested_skills);
      }
    } catch (err) {
      console.error("Error fetching suggested skills:", err);
    } finally {
      setSuggestingSkills(false);
    }
  };
  

  const handleExecuteQuery = async () => {
    const normalizedJobTitle = jobTitle ? jobTitle.toLowerCase().replace(/\s+/g, ",") : null;
    const filterData = {
      required_skill: skills || null,
      job_title: normalizedJobTitle,
      job_description: jobDescription || null,
      match_percentage: matchThreshold || 0,
      industry_experience: industryExperience || null,
      years_experience: yearsExperience || 0,
    };

    const baseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}`;
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(`${baseUrl}/ai-match-talents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterData),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await response.json();
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
  };

  return (
    <div className="talent-filter-container">
      <h2 className="text-center text-primary text-2xl font-bold mb-6">Talent Filter</h2>
      <form className="filter-form">
        <div className="filter-row">
          <div className="filter-field">
            <label>Job Title:</label>
            <input list="job-titles" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Backend Engineer" />
            <datalist id="job-titles">
              {jobTitles.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
          </div>
          <div className="filter-field">
            <label>Required Skill:</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. JavaScript, SQL, Docker" />
            <button
  type="button"
  onClick={handleSuggestSkills}
  disabled={!jobTitle.trim() || !jobDescription.trim() || suggestingSkills}
  style={{
    marginTop: "0.5rem",
    padding: "0.4rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: !jobTitle.trim() || !jobDescription.trim() ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }}
>
  {suggestingSkills ? (
    <>
      <span className="loader" style={{ width: "14px", height: "14px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      Suggesting...
    </>
  ) : (
    "Suggest Skills"
  )}
</button>

          </div>
        </div>
        <div className="filter-column">
          <div className="filter-field">
            <label>Required Experience:</label>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="e.g. Develop REST APIs with Express and PostgreSQL" rows="4" style={{ width: "100%" }} />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-field">
            <label>Industry Experience:</label>
            <input type="text" value={industryExperience} onChange={(e) => setIndustryExperience(e.target.value)} placeholder="e.g. IT, Finance" />
          </div>
          <div className="filter-field">
            <label>Years of Experience:</label>
            <input type="number" min="0" value={yearsExperience === 0 ? "" : yearsExperience} onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)} placeholder="e.g. 3" />
          </div>
        </div>
        <div className="filter-column">
          <div className="filter-field">
            <label>Match Threshold: {matchThreshold}%</label>
            <input type="range" min="0" max="100" value={matchThreshold} onChange={(e) => setMatchThreshold(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={handleExecuteQuery}>Query for Talents</Button>
          <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </form>
      {loading && (
  <div className="text-center mt-6">
    <p className="text-primary font-medium">
      <span className="hourglass-spin">⏳</span> Matching talents... Please wait, this may take up to 2 minutes.
    </p>
  </div>
)}

      <TalentResults results={results} selectedLocations={[]} availabilityFilter={""} workModeFilter={""} matchThreshold={matchThreshold} />
    </div>
  );
}

export default TalentFilter;