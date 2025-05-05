import React, { useState, useEffect } from "react";
import TalentResults from "./TalentResults";
import TalentDisplaySwitcher from "./TalentDisplaySwitcher";
import Button from "@/components/common/Button";
import "@/common/styles/App.css";

function TalentFilter({onResults}) {
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(0);
  //const [results, setResults] = useState([]);
  const [industryExperience, setIndustryExperience] = useState("");
  const [yearsExperience, setYearsExperience] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [suggestingSkills, setSuggestingSkills] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (jobTitle.trim() && jobDescription.trim()) {
        autoSuggestFields();
      }
    }, 800);
    return () => clearTimeout(delay);
  }, [jobTitle, jobDescription]);

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}/job-titles/all`
        );
        const data = await response.json();
        console.log("🟢 AI Match Response:", response.status, data);
        setJobTitles(data || []);
      } catch (err) {
        console.error("Failed to fetch job titles:", err);
      }
    };
    fetchJobTitles();
  }, []);

  const autoSuggestFields = async () => {
    if (suggestingSkills) return;
    setSuggestingSkills(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}/suggest-fields`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_title: jobTitle, job_description: jobDescription }),
        }
      );
      const data = await response.json();
      if (data.suggested_skills) setSkills(data.suggested_skills);
      if (data.industry_experience) setIndustryExperience(data.industry_experience);
      if (data.years_experience !== undefined) setYearsExperience(data.years_experience);
    } catch (err) {
      console.error("Error suggesting fields:", err);
    } finally {
      setSuggestingSkills(false);
    }
  };

  const handleSuggestSkills = async () => {
    await autoSuggestFields();
  };

  const handleExecuteQuery = async () => {
    const normalizedJobTitle = jobTitle ? jobTitle.toLowerCase().replace(/\s+/g, ",") : null;
    const filterData = {
      required_skill: skills || null,
      job_title: normalizedJobTitle,
      job_description: jobDescription || null,
      match_percentage: parseInt(matchThreshold) || 0,
      industry_experience: industryExperience || null,
      years_experience: yearsExperience || 0,
    };

    const baseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}`;
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);
      console.log("🧪 API URL:", `${baseUrl}/ai-match-talents`);

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
      //setResults(transformed);
      //onResults && onResults(transformed);
      //setResults(transformed)
      onResults(transformed)
    } catch (error) {
      console.error("🧪 API URL:", `${baseUrl}/ai-match-talents`);
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
      <form className="filter-form" onSubmit={(e) => { e.preventDefault(); handleExecuteQuery(); }}>
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
            <label>Required Skills:</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. JavaScript, SQL, Docker" />
            <button
              type="button"
              onClick={handleSuggestSkills}
              disabled={!jobTitle.trim() || !jobDescription.trim() || suggestingSkills}
              className="form-button"
            >
              {/*suggestingSkills ? "Suggesting..." : "Suggest Skills"*/}
              {suggestingSkills ? (
                <span className="animate-looking">👀 Looking......</span>
              ) : (
                "Suggest Skills"
              )}

            </button>
          </div>
        </div>

        <div className="filter-column">
        <div className="filter-field">
          <label>
            Required Experience:
            <span
              className="tooltip"
              title="Tip for best AI suggestions:
- Clearly describe technical skills and business context.
- Mention if it's for recruiting, staffing, human capital, finance, healthcare, etc.
- Include required years of experience if known.

Example:
'Building full-stack recruiting platform for Human Capital clients. Need 2+ years exp. in Node.js, PostgreSQL. Must demo to clients.'"
              style={{ marginLeft: "6px", cursor: "pointer", color: "#4c51bf" }}
            >
              ℹ️
            </span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="e.g. Build full-stack recruiting platforms for Human Capital industry clients. Must be able to demo to clients. 2+ years experience acceptable."
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
              value={yearsExperience === 0 ? "" : yearsExperience}
              onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
              placeholder="e.g. 3"
            />
          </div>
          <div className="filter-field">
            <label>Match Threshold (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={matchThreshold === 0 ? "" : matchThreshold}
              onChange={(e) => setMatchThreshold(parseInt(e.target.value) || 0)}
              placeholder="e.g. 3"
              style={{ width: "80px" }}
            />
          </div>
        </div>

        {/*<div className="filter-column">
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
        </div>*/}
        
         {/* <div className="filter-field">
            <label>Match Threshold (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={matchThreshold === 0 ? "" : matchThreshold}
              onChange={(e) => setMatchThreshold(parseInt(e.target.value) || 0)}
              placeholder="e.g. 3"
              style={{ width: "80px" }}
            />
          </div>*/}
        


        <div className="filter-row">
          <button type="submit" className="form-button">Search</button>
          <button type="button" onClick={handleClearFilters} className="form-button clear-button">Clear</button>
        </div>
      </form>

      {loading && (
        <div className="text-center mt-6">
          <p className="text-primary font-medium">
            <span className="hourglass-spin">⏳</span> Matching talents... Please wait a moment</p>
        </div>
      )}

      {/*<TalentResults results={results} selectedLocations={[]} availabilityFilter={""} workModeFilter={""} matchThreshold={matchThreshold} />*/}
      {/*<TalentDisplaySwitcher
        results={results}
        jobTitle={jobTitle}
        jobDescription={jobDescription}
        requiredSkills={skills}
      />*/}


    </div>
  );
}

export default TalentFilter;
