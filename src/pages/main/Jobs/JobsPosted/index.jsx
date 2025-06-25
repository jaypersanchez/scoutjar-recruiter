/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import MatchExplanationModal from "./MatchExplanationModal";
import "@/common/styles/App.css";

export default function JobsPosted() {
  const [jobs, setJobs] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [andrewLoading, setAndrewLoading] = useState(null);
  const [andrewMatches, setAndrewMatches] = useState({});
  const [modalExplanation, setModalExplanation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [shortlistStatus, setShortlistStatus] = useState({});
  const [isShortlisting, setIsShortlisting] = useState({});

  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;
  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;
  const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}`;
  const [jobCurrencies, setJobCurrencies] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});
  const [applicantsByJob, setApplicantsByJob] = useState({});


  const currencySymbols = {
    USD: "$",
    EUR: "€",
    ILS: "₪"
  };

  const fetchCurrencies = async (jobsList) => {
  const currencies = {};
  await Promise.all(
    jobsList.map(async (job) => {
      try {
        const res = await fetch(`${baseUrl}/jobs/currency/${job.job_id}`);
        const data = await res.json();
        currencies[job.job_id] = data.currency || 'USD';
      } catch (err) {
        currencies[job.job_id] = 'USD';
      }
    })
  );
  setJobCurrencies(currencies);
};


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${baseUrl}/jobs/get`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recruiter_id: recruiterId })
        });

        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        setJobs(data);
        fetchApplicantCounts(data.map((job) => job.job_id));
        fetchCurrencies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchApplicantCounts = async (jobIds) => {
      try {
        const response = await fetch(`${baseUrl}/job-applicants/count/${recruiterId}`);
        if (!response.ok) throw new Error("Failed to fetch applicant counts");

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

  /*const fetchApplicantsForJob = async (jobId) => {
      try {
        const response = await fetch(`${baseUrl}/job-applicants/job/${jobId}`);
        const data = await response.json();
        setApplicantsByJob((prev) => ({ ...prev, [jobId]: data }));
      } catch (err) {
        console.error("Error fetching applicants for job", jobId, err);
      }
    };*/
    const fetchApplicantsForJob = async (jobId) => {
      try {
        const response = await fetch(`${baseUrl}/job-applicants/job/${jobId}/recruiter/${recruiterId}`);
        if (!response.ok) throw new Error("Failed to fetch applicants");
        const data = await response.json();
        setApplicantsByJob((prev) => ({ ...prev, [jobId]: data }));
      } catch (err) {
        console.error("Error fetching applicants for job", jobId, err);
      }
    };

  const askAndrew = async (job) => {
    setAndrewLoading(job.job_id);
    console.log(`${AIbaseUrl}`)
    try {
      const response = await fetch(`${AIbaseUrl}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: job.job_title,
          description: job.job_description,
          skills: job.required_skills?.join(", ") || ""
        })
      });
      const data = await response.json();
      setAndrewMatches((prev) => ({ ...prev, [job.job_id]: data.matches }));
    } catch (err) {
      alert("Andrew ran into a problem finding matches. Please try again later.");
    } finally {
      setAndrewLoading(null);
    }
  };

  const explainMatch = async (job, match) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${AIbaseUrl}/explain-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, talent: match })
      });
      const data = await response.json();
      const updatedExplanation = data.explanation;
      setAndrewMatches((prev) => ({
        ...prev,
        [job.job_id]: prev[job.job_id].map((m) =>
          m.talent_id === match.talent_id ? { ...m, explanation: updatedExplanation } : m
        )
      }));
      setModalExplanation(updatedExplanation);
      setShowModal(true);
    } catch (err) {
      alert("Could not explain this match right now. Try again later.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleInfoClick = async (job, match) => {
    if (match.explanation) {
      setModalExplanation(match.explanation);
      setShowModal(true);
    } else {
      await explainMatch(job, match);
    }
  };

  const handleAiShortlist = async (jobId, talentId) => {
    const storedUser = sessionStorage.getItem("sso-login");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const recruiterId = user?.recruiter_id;
  
    if (!recruiterId) {
      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: "Recruiter not logged in",
      }));
      return;
    }
  
    setIsShortlisting((prev) => ({ ...prev, [talentId]: true }));
  
    try {
      const response = await fetch(`${AIbaseUrl}/ai-shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruiter_id: recruiterId, talent_id: talentId }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Shortlisting failed");
      }
  
      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: "✅ Added to Talent Filter Shortlist",
      }));
    } catch (err) {
      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: `❌ ${err.message}`,
      }));
    } finally {
      setIsShortlisting((prev) => ({ ...prev, [talentId]: false }));
    }
  };

  const getBadgeInfo = (score) => {
    const numericScore = Number(score);
    if (numericScore >= 90) return { badge: "A+", color: "#2e8b57", icon: "🚀" };
    if (numericScore >= 80) return { badge: "A", color: "#3cb371", icon: "🔥" };
    if (numericScore >= 70) return { badge: "A−", color: "#66cdaa", icon: "🏎️" };
    if (numericScore >= 60) return { badge: "B+", color: "#ffd700", icon: "💼" };
    if (numericScore >= 50) return { badge: "B", color: "#f0e68c", icon: "🔧" };
    if (numericScore >= 40) return { badge: "B−", color: "#ffa07a", icon: "🧠" };
    if (numericScore >= 30) return { badge: "C", color: "#ffb6c1", icon: "🌱" };
    return { badge: "D", color: "#a9a9a9", icon: "🐢", iconSize: "0.8em" };
  };
  
  

  if (loading) return <p>Loading job posts...</p>;
  if (error) return <p>Error: {error}</p>;

  /*return (
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
              {job.required_skills?.length > 0 && (
                <p><strong>Skills:</strong> {job.required_skills.join(", ")}</p>
              )}
              {job.experience_level && <p><strong>Experience Level:</strong> {job.experience_level}</p>}
              {job.employment_type && <p><strong>Employment Type:</strong> {job.employment_type}</p>}
              {job.salary_range?.length === 2 && <p><strong>Salary Range:</strong> {job.salary_range[0]} - {job.salary_range[1]}</p>}
              {job.work_mode && <p><strong>Work Mode:</strong> {job.work_mode}</p>}
              {job.location && <p><strong>Location:</strong> {job.location}</p>}
              {job.date_posted && <p><strong>Date Posted:</strong> {new Date(job.date_posted).toLocaleString()}</p>}
              <div className="applicant-count">
                <span className="label">Number of Applicants:</span>
                <span className="count">{applicantCounts[job.job_id] ?? 0}</span>
              </div>

              <button onClick={() => askAndrew(job)} disabled={andrewLoading === job.job_id}>
                {andrewLoading === job.job_id ? "LooKKing..." : "✨ Ask LooKK, our AI Agent, to find you a match"}
              </button>

              {andrewMatches[job.job_id] && (
                <div className="andrew-results">
                  <h4>By LooKKing we found {andrewMatches[job.job_id].length} match(es):</h4>
                  <table className="match-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Match %</th>
                        <th>Location</th>
                        <th>Availability</th>
                        <th>Skills</th>
                        <th>Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...andrewMatches[job.job_id]]
                        .sort((a, b) => b.match_score - a.match_score)
                        .map((match) => {
                          const { badge, color, icon } = getBadgeInfo(match.match_score);
                          return (
                            <tr key={match.talent_id}>
                              <td>{match.name}</td>
                              <td style={{ color, fontWeight: "bold" }}>
                                {icon} {match.match_score}% <small style={{ fontSize: "0.8em" }}>({badge})</small>
                              </td>
                              <td>{match.location}</td>
                              <td>{match.availability}</td>
                              <td>{(match.skills || []).join(", ")}</td>
                              <td>
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <button
      title="Explain this match"
      onClick={() => handleInfoClick(job, match)}
      style={{ border: "none", background: "none", cursor: "pointer" }}
    >
      ℹ️
    </button>
    <button
      title="Shortlist to Talent Filter"
      onClick={() => handleAiShortlist(job.job_id, match.talent_id)}
      disabled={isShortlisting[match.talent_id]}
      style={{ border: "none", background: "none", cursor: "pointer" }}
    >
      📌
    </button>
  </div>

  {shortlistStatus[match.talent_id] && (
    <div style={{ fontSize: "11px", color: "#4c51bf", marginTop: "2px" }}>
      {shortlistStatus[match.talent_id]}
    </div>
  )}
</td>

                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <MatchExplanationModal
          explanation={modalExplanation}
          loading={modalLoading}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );*/
  return (
  <div className="job-posts-container">
    <h2>My Job Posts</h2>
    {jobs.length === 0 ? (
      <p>No job posts found.</p>
    ) : (
      <div className="job-posts-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {jobs.map((job) => (
          <div
            key={job.job_id}
              onClick={() => {
                setExpandedJobs((prev) => ({
                  ...prev,
                  [job.job_id]: !prev[job.job_id],
                }));
                if (!applicantsByJob[job.job_id]) fetchApplicantsForJob(job.job_id);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#f9fafb"
              }}
          >
            {/* Job Details */}
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#2d3748" }}>
                #{job.job_id} - {job.job_title}
              </div>
              <div style={{ fontSize: "1rem", color: "#4a5568", marginTop: "6px" }}>
                {job.job_description}
              </div>
              <div style={{ fontSize: "1rem", color: "#4a5568", marginTop: "6px" }}>
                📍 {job.location} | 🧠 {(job.required_skills || []).join(", ")} | 💼 {job.employment_type} | 🏢 {job.work_mode}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#718096", marginTop: "6px" }}>
                {/*Experience: {job.experience_level || "N/A"} | Salary: {job.salary_range?.[0]} - {job.salary_range?.[1]}*/}
                Experience: {job.experience_level || "N/A"} | Salary: {currencySymbols[jobCurrencies[job.job_id] || 'USD']}{job.salary_range?.[0]} - {currencySymbols[jobCurrencies[job.job_id] || 'USD']}{job.salary_range?.[1]}

              </div>
              <div style={{ fontSize: "0.95rem", color: "#718096", marginTop: "6px" }}>
                📅 Posted: {new Date(job.date_posted).toLocaleDateString()} | Applicants: {applicantCounts[job.job_id] ?? 0}
              </div>
            </div>

            {/* Ask LooKK Button */}
            {/*<div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => askAndrew(job)}
                disabled={andrewLoading === job.job_id}
                style={{
                  fontSize: "12px",
                  backgroundColor: "#4c51bf",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {andrewLoading === job.job_id ? "LooKKing..." : "✨ Ask LooKK"}
              </button>
            </div>*/}

            {/* Matched Talents */}
            {andrewMatches[job.job_id] && (
              <div style={{ marginTop: "8px", width: "100%" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "bold", color: "#2d3748", marginBottom: "8px" }}>
                  Found {andrewMatches[job.job_id].length} match(es):
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[...andrewMatches[job.job_id]]
                    .sort((a, b) => b.match_score - a.match_score)
                    .map((match) => {
                      const { badge, color, icon } = getBadgeInfo(match.match_score);
                      return (
                        <div
                          key={match.talent_id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px",
                            border: "1px solid #cbd5e0",
                            borderRadius: "6px",
                            backgroundColor: "#edf2f7"
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{match.name}</div>
                            <div style={{ color: "#4a5568", marginTop: "4px" }}>
                              📍 {match.location} | 🛠 {match.skills?.join(", ") || "No skills"} | 🕒 {match.availability}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", minWidth: "120px" }}>
                            <div style={{ fontWeight: "bold", color }}>
                              {icon} {Math.round(match.match_score)}% <small>({badge})</small>
                            </div>
                            <div style={{ display: "flex", gap: "6px", marginTop: "4px", justifyContent: "flex-end" }}>
                              <button
                                onClick={() => handleInfoClick(job, match)}
                                title="Explain this match"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                              >
                                ℹ️
                              </button>
                              <button
                                onClick={() => handleAiShortlist(job.job_id, match.talent_id)}
                                disabled={isShortlisting[match.talent_id]}
                                title="Shortlist"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                              >
                                📌
                              </button>
                            </div>
                            {shortlistStatus[match.talent_id] && (
                              <div style={{ fontSize: "11px", color: "#4c51bf", marginTop: "2px" }}>
                                {shortlistStatus[match.talent_id]}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {expandedJobs[job.job_id] && applicantsByJob[job.job_id] && (
              <div style={{ marginTop: "10px", padding: "12px", backgroundColor: "#f7fafc", borderRadius: "6px" }}>
                <h4 style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "6px" }}>Applicants for this job:</h4>
                <ul style={{ paddingLeft: "16px", listStyle: "disc" }}>
                  {applicantsByJob[job.job_id].map((applicant) => (
                    <li key={applicant.talent_id} style={{ marginBottom: "10px", lineHeight: "1.5" }}>
    <strong>{applicant.full_name || applicant.name}</strong> — {applicant.email || "No email"}
    <div style={{ marginLeft: "12px", fontSize: "0.9rem", color: "#4a5568" }}>
      📍 Location: {applicant.location || "N/A"}<br />
      🛠 Skills: {(applicant.skills || []).join(", ") || "N/A"}<br />
      💰 Desired Salary: {applicant.desired_salary || "N/A"}<br />
      🏢 Work Mode: {applicant.work_mode || "N/A"}<br />
      🕒 Availability: {applicant.availability || "N/A"}
    </div>
  </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ))}
      </div>
    )}

    {/* Explanation Modal */}
    {showModal && (
      <MatchExplanationModal
        explanation={modalExplanation}
        loading={modalLoading}
        onClose={() => setShowModal(false)}
      />
    )}
  </div>
);


}
