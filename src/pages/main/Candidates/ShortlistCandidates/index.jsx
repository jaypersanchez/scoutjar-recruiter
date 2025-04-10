import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";
import TalentDetailModal from "../ReviewCandidates/TalentDetailModal";

export default function ShortlistedCandidates() {
  const [groupedCandidates, setGroupedCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;

  // Get recruiter_id from sessionStorage
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

  /*const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };*/

  const handleCandidateClick = async (candidate) => {
    try {
      const response = await fetch(`${baseUrl}/talent-profiles/${candidate.talent_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch full profile");
      }
  
      const fullProfile = await response.json();
  
      // Merge shortlist data with full profile
      const merged = {
        ...fullProfile,
        shortlist_id: candidate.shortlist_id,
        job_id: selectedJob, // include job ID from selection
        added_at: candidate.added_at,
      };
  
      setSelectedCandidate(merged);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading talent profile:", err);
      alert("Could not load full profile for this candidate.");
    }
  };
 

  const closeModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  // Find the candidate group for the selected job
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
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Email</th>
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
                <td className="px-4 py-2 border text-center">{candidate.shortlist_id}</td>
                <td className="px-4 py-2 border text-center">{candidate.talent_id}</td>
                <td className="px-4 py-2 border text-center">{candidate.full_name}</td>
                <td className="px-4 py-2 border text-center">{candidate.email}</td>
                <td className="px-4 py-2 border text-center">
                  {new Date(candidate.added_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No shortlisted candidates for this job.</p>
      )}
      {showModal && selectedCandidate && (
        <TalentDetailModal applicant={selectedCandidate} onClose={closeModal} />
      )}
    </div>
  );
}
