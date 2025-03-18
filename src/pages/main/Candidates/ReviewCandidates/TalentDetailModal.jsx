import React, { useState } from "react";
import MessageTalentModal from "../ReviewCandidates/MessageTalentModal";

export default function TalentDetailModal({ applicant, onClose, showShortlist = false }) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [shortlistStatus, setShortlistStatus] = useState(null);
  const [isShortlisting, setIsShortlisting] = useState(false);



  // Handler to shortlist candidate via API
  const handleShortlist = async () => {
    setIsShortlisting(true);
    try {
      // Retrieve recruiter_id from session storage
      const storedUser = sessionStorage.getItem("sso-login");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const recruiterId = user ? user.recruiter_id : null;
      if (!recruiterId) {
        setShortlistStatus("Recruiter not logged in.");
        setIsShortlisting(false);
        return;
      }
      // Prepare the payload with recruiter_id, talent_id, and job_id.
      const payload = {
        recruiter_id: recruiterId,
        talent_id: applicant.talent_id,
        job_id: applicant.job_id, // make sure applicant includes job_id
      };
      const response = await fetch("http://localhost:5000/shortlisted-candidates/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setShortlistStatus(`Error: ${errorData.error}`);
      } else {
        // No need to store the data if it's not used
        await response.json();
        setShortlistStatus("Candidate shortlisted successfully!");
      }
    } catch {
      setShortlistStatus("Error shortlisting candidate.");
    } finally {
      setIsShortlisting(false);
    }
  };

  const handleOpenMessage = () => {
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  const handleMailto = () => {
    const subject = encodeURIComponent("Job Opportunity");
    const body = encodeURIComponent(
      `Hi ${applicant.full_name},\n\nI would like to discuss an opportunity with you.\n\nRegards,\nYour Recruiter`
    );
    window.location.href = `mailto:${applicant.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-4">Talent Details</h3>
        <div className="space-y-2 mb-4">
          <p>
            <span className="font-semibold">Application ID:</span> {applicant.application_id}
          </p>
          <p>
            <span className="font-semibold">Talent ID:</span> {applicant.talent_id}
          </p>
          <p>
            <span className="font-semibold">User ID:</span> {applicant.user_id}
          </p>
          <p>
            <span className="font-semibold">Full Name:</span> {applicant.full_name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {applicant.email}
          </p>
          {applicant.job_id && (
            <p>
              <span className="font-semibold">Job ID:</span> {applicant.job_id}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleOpenMessage}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Message In-App
            </button>
            <button
              onClick={handleMailto}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Email
            </button>
          </div>
          {showShortlist && (
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
          {shortlistStatus && (
            <p className="mt-2 text-center text-sm">{shortlistStatus}</p>
          )}
        </div>
        {showMessageModal && (
          <MessageTalentModal applicant={applicant} onClose={closeMessageModal} />
        )}
      </div>
    </div>
  );
}
