import React, { useState } from "react";
import MessageTalentModal from "../ReviewCandidates/MessageTalentModal";

export default function TalentDetailModal({ applicant, onClose, showShortlist = false }) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [shortlistStatus, setShortlistStatus] = useState(null);
  const [isShortlisting, setIsShortlisting] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;

  const handleShortlist = async () => {
    setIsShortlisting(true);
    try {
      const storedUser = sessionStorage.getItem("sso-login");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const recruiterId = user ? user.recruiter_id : null;
      if (!recruiterId) {
        setShortlistStatus("Recruiter not logged in.");
        setIsShortlisting(false);
        return;
      }

      const payload = {
        recruiter_id: recruiterId,
        talent_id: applicant.talent_id,
        job_id: applicant.job_id,
      };

      const response = await fetch(`${baseUrl}/shortlisted-candidates/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setShortlistStatus(`Error: ${errorData.error}`);
      } else {
        await response.json();
        setShortlistStatus("Candidate shortlisted successfully!");
      }
    } catch {
      setShortlistStatus("Error shortlisting candidate.");
    } finally {
      setIsShortlisting(false);
    }
  };

  const handleOpenMessage = () => setShowMessageModal(true);
  const closeMessageModal = () => setShowMessageModal(false);

  const handleMailto = () => {
    const subject = encodeURIComponent("Job Opportunity");
    const body = encodeURIComponent(
      `Hi ${applicant.full_name},\n\nI would like to discuss an opportunity with you.\n\nRegards,\nYour Recruiter`
    );
    window.location.href = `mailto:${applicant.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div
        className="bg-white p-6 rounded shadow-lg w-11/12 max-w-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">
            &times;
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Talent Profile</h3>

        <div className="space-y-2 mb-4 text-sm">
          <p><strong>Talent ID:</strong> {applicant.talent_id}</p>
          <p><strong>User ID:</strong> {applicant.user_id}</p>
          <div className="flex items-center gap-4 mb-4">
  <img
    src={applicant.profile_picture || "https://via.placeholder.com/80"}
    alt={applicant.full_name}
    className="w-20 h-20 rounded-full object-cover border"
  />
  <div>
    <h3 className="text-xl font-semibold">{applicant.full_name}</h3>
    <p className="text-sm text-gray-600">{applicant.email}</p>
  </div>
</div>
          {applicant.job_id && (
            <p><strong>Job ID:</strong> {applicant.job_id}</p>
          )}
          {applicant.location && <p><strong>Location:</strong> {applicant.location}</p>}
          {applicant.desired_salary && (
            <p><strong>Desired Salary:</strong> ${parseInt(applicant.desired_salary).toLocaleString()}</p>
          )}
          {applicant.availability && <p><strong>Availability:</strong> {applicant.availability}</p>}
          {applicant.available_from && (
            <p><strong>Available From:</strong> {new Date(applicant.available_from).toLocaleDateString()}</p>
          )}
          {applicant.work_preferences?.work_mode && (
            <p><strong>Work Mode:</strong> {applicant.work_preferences.work_mode}</p>
          )}
          {applicant.education && (
            <p><strong>Education:</strong> {applicant.education}</p>
          )}
        </div>

        {applicant.skills && applicant.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Skills</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {applicant.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-200 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {applicant.bio && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Bio</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{applicant.bio}</p>
          </div>
        )}

        {applicant.experience && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Experience</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{applicant.experience}</p>
          </div>
        )}

        {applicant.resume && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Resume</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{applicant.resume}</p>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <button
            onClick={handleOpenMessage}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approach
          </button>
          <button
            onClick={handleMailto}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Email
          </button>
          {showShortlist && applicant.job_id && (
            <button
              onClick={handleShortlist}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              disabled={isShortlisting}
            >
              {isShortlisting ? "Shortlisting..." : "Shortlist Candidate"}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>

        {shortlistStatus && (
          <p className="mt-2 text-center text-sm text-red-600">{shortlistStatus}</p>
        )}

        {showMessageModal && (
          <MessageTalentModal applicant={applicant} onClose={closeMessageModal} />
        )}
      </div>
    </div>
  );
}
