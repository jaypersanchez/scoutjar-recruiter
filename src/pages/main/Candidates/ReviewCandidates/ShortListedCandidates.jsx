import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";
import TalentDetailModal from "./TalentDetailModal";

export default function ShortlistedCandidates() {
  const [groupedCandidates, setGroupedCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;

  // Retrieve recruiter id from session storage
  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;

  useEffect(() => {
    if (!recruiterId) {
      setError("Recruiter not logged in.");
      setLoading(false);
      return;
    }
    async function fetchGroupedCandidates() {
      try {
        const response = await fetch(`${baseUrl}/shortlisted-candidates/grouped`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recruiter_id: recruiterId }),
        });
        if (!response.ok) {
          throw new Error("Error fetching shortlisted candidates");
        }
        const data = await response.json();
        setGroupedCandidates(data);
        // Set default selected job to the first available job_id (if any)
        if (data.length > 0) {
          setSelectedJob(data[0].job_id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGroupedCandidates();
  }, [recruiterId]);

  const handleJobChange = (e) => {
    setSelectedJob(e.target.value);
  };

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  // Find the group corresponding to the selected job
  const selectedGroup = groupedCandidates.find(
    (group) => String(group.job_id) === String(selectedJob)
  );

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 uppercase text-center text-primary">
        Shortlisted Candidates
      </h2>
      <div className="mb-4">
        <label htmlFor="jobSelect" className="block mb-1 font-semibold">
          Select Job ID:
        </label>
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
      {selectedGroup && selectedGroup.candidates && selectedGroup.candidates.length > 0 ? (
        <table className="min-w-full border-collapse results-table">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Shortlist ID</th>
              <th className="px-4 py-2 border">Talent ID</th>
              <th className="px-4 py-2 border">Added At</th>
            </tr>
          </thead>
          <tbody>
            {selectedGroup.candidates.map((candidate) => (
              <tr
                key={candidate.shortlist_id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCandidateClick(candidate)}
              >
                <td className="px-4 py-2 border text-center">
                  {candidate.shortlist_id}
                </td>
                <td className="px-4 py-2 border text-center">
                  {candidate.talent_id}
                </td>
                <td className="px-4 py-2 border text-center">
                  {new Date(candidate.added_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No shortlisted candidates for this job.</p>
      )}
      {showModal && selectedCandidate && (
        <TalentDetailModal applicant={selectedCandidate} onClose={closeModal} />
      )}
    </div>
  );
}
