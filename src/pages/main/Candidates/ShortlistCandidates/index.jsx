import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";
import TalentDetailModal from "../ReviewCandidates/TalentDetailModal";

export default function ShortlistedCandidates() {
  const [groupedCandidates, setGroupedCandidates] = useState([]);
  const [aiShortlisted, setAiShortlisted] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("job");

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;
  const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}`;

  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;

  useEffect(() => {
    if (!recruiterId) {
      setError("Recruiter not logged in.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [jobRes, aiRes] = await Promise.all([
          fetch(`${baseUrl}/shortlisted-candidates/grouped`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recruiter_id: recruiterId }),
          }),
          fetch(`${AIbaseUrl}/ai-shortlisted-candidates`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recruiter_id: recruiterId }),
          }),
        ]);

        if (!jobRes.ok || !aiRes.ok) throw new Error("Failed to fetch shortlist data");

        const jobData = await jobRes.json();
        const aiData = await aiRes.json();

        setGroupedCandidates(jobData);
        setAiShortlisted(aiData);

        if (jobData.length > 0) setSelectedJob(jobData[0].job_id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [recruiterId]);

  const handleJobChange = (e) => {
    setSelectedJob(e.target.value);
  };

  const handleCandidateClick = async (candidate) => {
    try {
      const response = await fetch(`${baseUrl}/talent-profiles/${candidate.talent_id}`);
      if (!response.ok) throw new Error("Failed to fetch full profile");

      const fullProfile = await response.json();
      const merged = {
        ...fullProfile,
        shortlist_id: candidate.shortlist_id,
        job_id: candidate.job_id || selectedJob,
        added_at: candidate.added_at,
      };

      setSelectedCandidate(merged);
      setShowModal(true);
    } catch (err) {
      alert("Could not load full profile.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  const selectedGroup = groupedCandidates.find(
    (group) => String(group.job_id) === String(selectedJob)
  );

  if (loading) {
    return (
      <div className="spinner-container flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4 recruiter-content">
      <h2 className="text-2xl font-bold mb-4 uppercase text-center text-primary">
        Shortlisted Candidates
      </h2>

      <div className="mb-4 text-center space-x-4">
        <button
          onClick={() => setViewMode("job")}
          className={`px-4 py-2 rounded ${viewMode === "job" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          🔖 Job Shortlist
        </button>
        <button
          onClick={() => setViewMode("ai")}
          className={`px-4 py-2 rounded ${viewMode === "ai" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          🤖 AI Shortlist
        </button>
      </div>

      {viewMode === "job" && (
        <>
          <div className="mb-4">
            <label htmlFor="jobSelect" className="block mb-1 font-semibold">Select Job ID:</label>
            <select
              id="jobSelect"
              className="form-input w-full"
              value={selectedJob}
              onChange={handleJobChange}
            >
              {groupedCandidates.map((group) => (
                <option key={group.job_id} value={group.job_id}>
                  Job ID: {group.job_id}
                </option>
              ))}
            </select>
          </div>
          {selectedGroup && selectedGroup.candidates?.length > 0 ? (
            <table className="min-w-full border-collapse results-table">
              <thead><tr className="bg-gray-200">
                <th className="px-4 py-2 border">Shortlist ID</th>
                <th className="px-4 py-2 border">Talent ID</th>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Added At</th>
              </tr></thead>
              <tbody>
                {selectedGroup.candidates.map((c) => (
                  <tr
                    key={c.shortlist_id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCandidateClick(c)}
                  >
                    <td className="px-4 py-2 border text-center">{c.shortlist_id}</td>
                    <td className="px-4 py-2 border text-center">{c.talent_id}</td>
                    <td className="px-4 py-2 border text-center">{c.full_name}</td>
                    <td className="px-4 py-2 border text-center">{c.email}</td>
                    <td className="px-4 py-2 border text-center">{new Date(c.added_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No shortlisted candidates for this job.</p>
          )}
        </>
      )}

      {viewMode === "ai" && (
        aiShortlisted?.length > 0 ? (
          <table className="min-w-full border-collapse results-table">
            <thead><tr className="bg-purple-100">
              <th className="px-4 py-2 border">Shortlist ID</th>
              <th className="px-4 py-2 border">Talent ID</th>
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Added At</th>
            </tr></thead>
            <tbody>
              {aiShortlisted.map((c) => (
                <tr
                  key={c.shortlist_id}
                  className="hover:bg-purple-50 cursor-pointer"
                  onClick={() => handleCandidateClick(c)}
                >
                  <td className="px-4 py-2 border text-center">{c.shortlist_id}</td>
                  <td className="px-4 py-2 border text-center">{c.talent_id}</td>
                  <td className="px-4 py-2 border text-center">{c.full_name}</td>
                  <td className="px-4 py-2 border text-center">{c.email}</td>
                  <td className="px-4 py-2 border text-center">{new Date(c.added_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No AI-shortlisted candidates found.</p>
        )
      )}

      {showModal && selectedCandidate && (
        <TalentDetailModal applicant={selectedCandidate} onClose={closeModal} />
      )}
    </div>
  );
}
