import React, { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import "@/common/styles/App.css";

function TalentFilter({ onResults }) {
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [industryExperience, setIndustryExperience] = useState("");
  const [yearsExperience, setYearsExperience] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [suggestingSkills, setSuggestingSkills] = useState(false);

  /*useEffect(() => {
    const delay = setTimeout(() => {
      if (jobTitle.trim() && jobDescription.trim()) {
        autoSuggestFields();
      }
    }, 800);
    return () => clearTimeout(delay);
  }, [jobTitle, jobDescription]);*/

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}/job-titles/all`
        );
        const data = await response.json();
        setJobTitles(data || []);
      } catch (err) {
        console.error("Failed to fetch job titles:", err);
      }
    };
    fetchJobTitles();
  }, []);

  /*const autoSuggestFields = async () => {
    if (suggestingSkills) return;
    setSuggestingSkills(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}/suggest-fields`,
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
  };*/

  const autoSuggestFields = async () => {
  if (suggestingSkills) return;
  setSuggestingSkills(true);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}/suggest-fields`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_title: jobTitle, job_description: jobDescription }),
      }
    );
    const data = await response.json();

    // Append suggestions to user-provided input
    if (data.suggested_skills) {
      setSkills((prev) =>
        prev ? `${prev}, ${data.suggested_skills}` : data.suggested_skills
      );
    }

    if (data.industry_experience) {
      setIndustryExperience((prev) =>
        prev && prev !== data.industry_experience
          ? `${prev}, ${data.industry_experience}`
          : data.industry_experience
      );
    }

    if (data.years_experience !== undefined) {
      setYearsExperience((prev) =>
        prev && prev !== data.years_experience ? data.years_experience : prev
      );
    }
  } catch (err) {
    console.error("Error suggesting fields:", err);
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
      match_percentage: parseInt(matchThreshold) || 0,
      industry_experience: industryExperience || null,
      years_experience: yearsExperience || 0,
    };

    const baseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}`;
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
        country: item.country || "",
        country_code: item.country_code || "",
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
        profile_mode: typeof item.profile_mode === "string" ? item.profile_mode : null,
      }));

      console.log("🔍 Transformed profile_modes:", transformed.map(t => ({
  id: t.talent_id,
  name: t.full_name,
  mode: t.profile_mode
})));

      // ✅ Send results and job context
      onResults &&
        onResults(transformed, {
          jobTitle,
          jobDescription,
          requiredSkills: skills,
        });
    } catch (error) {
      console.error("TalentFilter error:", error);
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
  };

  return (
    <div className="talent-filter-container">
      <h2 className="text-center text-primary text-2xl font-bold mb-6">Talent Filter</h2>
      <form
        className="filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleExecuteQuery();
        }}
      >
        <div className="filter-row">
          <div className="filter-field">
            <label>Job Title:</label>
            <input
  list="job-titles"
  type="text"
  value={jobTitle}
  onChange={(e) => {
    const selectedTitle = e.target.value;
    setJobTitle(selectedTitle);

    const match = jobTitles.find(j => j.job_title === selectedTitle);
    if (match && match.job_description) {
      setJobDescription(match.job_description);
    }
  }}
  placeholder="e.g. Backend Engineer"
/>
<datalist id="job-titles">
  {jobTitles.map((jt) => (
    <option key={jt.job_title} value={jt.job_title} />
  ))}
</datalist>

          </div>

          <div className="filter-field">
            <label>Required Skills:</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, SQL, Docker"
            />
            <button
              type="button"
              onClick={autoSuggestFields}
              disabled={!jobTitle.trim() || !jobDescription.trim() || suggestingSkills}
              className="form-button"
            >
              {suggestingSkills ? <span className="animate-looking">👀 Looking...</span> : "Suggest Skills"}
            </button>
            <small className="text-muted">
              Suggestions will be added to your input
            </small>

          </div>
        </div>

        <div className="filter-column">
          <div className="filter-field">
            <label>Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Describe the job responsibilities and goals..."
              rows="4"
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
              value={yearsExperience || ""}
              onChange={(e) => setYearsExperience(Number(e.target.value) || 0)}
              placeholder="e.g. 3"
            />
          </div>
          <div className="filter-field">
          <label>
  Match Threshold (%)
  <span
    title="Filters talents by how closely they match your job post. Use clear titles and detailed descriptions for better results."
    style={{
      marginLeft: "6px",
      cursor: "help",
      color: "#555",
      fontSize: "16px",
    }}
  >
    ℹ️
  </span>
</label>
            <input
              type="number"
              value={matchThreshold || ""}
              onChange={(e) => setMatchThreshold(Number(e.target.value) || 0)}
              placeholder="e.g. 50"
            />
          </div>
        </div>

        <div className="filter-row">
          <button type="submit" className="form-button">
            Search
          </button>
          <button type="button" onClick={handleClearFilters} className="form-button clear-button">
            Clear
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center mt-6">
          <p className="text-primary font-medium">
            <span className="hourglass-spin">⏳</span> Matching talents... Please wait a moment
          </p>
        </div>
      )}
    </div>
  );
}

export default TalentFilter;
