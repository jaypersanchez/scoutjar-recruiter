// At the top of the file
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "@/common/styles/App.css";

export default function JobsPosted() {
  const [jobs, setJobs] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve user info from sessionStorage
  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/jobs/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recruiter_id: recruiterId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
        fetchApplicantCounts(data.map(job => job.job_id)); // get applicant count after jobs are loaded
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchApplicantCounts = async (jobIds) => {
      try {
        const response = await fetch(`http://localhost:5000/job-applicants/count/${recruiterId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch applicant counts");
        }
        const data = await response.json();

        const counts = {};
        data.forEach((row) => {
          counts[row.job_id] = parseInt(row.applicant_count);
        });

        setApplicantCounts(counts);
      } catch (err) {
        console.error("Error fetching applicant counts:", err);
      }
    };

    if (recruiterId !== null) {
      fetchJobs();
    } else {
      setError("Recruiter not logged in.");
      setLoading(false);
    }
  }, [recruiterId]);

  if (loading) return <p>Loading job posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="job-posts-container">
      <h2>My Job Posts</h2>
      {jobs.length === 0 ? (
        <p>No job posts found.</p>
      ) : (
        <ul className="job-posts-list">
          {jobs.map((job) => (
            <li key={job.job_id} className="job-post-item">
              <p><strong>Job ID:</strong> {job.job_id}</p>

              <h3>{job.job_title}</h3>
              <p>{job.job_description}</p>
              {job.required_skills && job.required_skills.length > 0 && (
                <p>
                  <strong>Skills:</strong> {job.required_skills.join(", ")}
                </p>
              )}
              {job.experience_level && (
                <p>
                  <strong>Experience Level:</strong> {job.experience_level}
                </p>
              )}
              {job.employment_type && (
                <p>
                  <strong>Employment Type:</strong> {job.employment_type}
                </p>
              )}
              {job.salary_range && job.salary_range.length === 2 && (
                <p>
                  <strong>Salary Range:</strong> {job.salary_range[0]} - {job.salary_range[1]}
                </p>
              )}
              {job.work_mode && (
                <p>
                  <strong>Work Mode:</strong> {job.work_mode}
                </p>
              )}
              {job.location && (
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
              )}
              {job.date_posted && (
                <p>
                  <strong>Date Posted:</strong>{" "}
                  {new Date(job.date_posted).toLocaleString()}
                </p>
              )}
              <p>
                <strong>Applicants:</strong>{" "}
                {applicantCounts[job.job_id] ?? 0}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
