import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";

export default function ApplicantFilter({ onFilter }) {
  const [email, setEmail] = useState("");
  const [talentId, setTalentId] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Get the logged in recruiter from sessionStorage.
    const storedUser = sessionStorage.getItem("sso-login");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const recruiterId = user ? user.recruiter_id : null;

    if (recruiterId) {
      // Fetch jobs posted by this recruiter.
      fetch(`http://localhost:5000/jobs?recruiter_id=${recruiterId}`)
        .then((response) => response.json())
        .then((data) => setJobs(data))
        .catch((error) =>
          console.error("Error fetching recruiter jobs:", error)
        );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      email: email.trim(),
      talent_id: talentId.trim(),
      job_id: selectedJob, // Pass along the selected job id
    });
  };

  return (
    <div className="talent-filter-container">
      <h2 className="form-title">Filter Applicants</h2>
      <form onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter email"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="talentId">Talent ID:</label>
            <input
              type="text"
              id="talentId"
              value={talentId}
              onChange={(e) => setTalentId(e.target.value)}
              className="form-input"
              placeholder="Enter Talent ID"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="jobSelect">Select Job:</label>
            <select
              id="jobSelect"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="form-input"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.job_id} value={job.job_id}>
                  {job.job_title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-buttons">
          <button type="submit" className="form-button">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
