import React, { useState } from "react";
import MessageTalentModal from "../ReviewCandidates/MessageTalentModal";

export default function TalentDetailModal({ applicant, onClose }) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  
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
          <p><span className="font-semibold">Application ID:</span> {applicant.application_id}</p>
          <p><span className="font-semibold">Talent ID:</span> {applicant.talent_id}</p>
          <p><span className="font-semibold">User ID:</span> {applicant.user_id}</p>
          <p><span className="font-semibold">Full Name:</span> {applicant.full_name}</p>
          <p><span className="font-semibold">Email:</span> {applicant.email}</p>
        </div>
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
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
        {showMessageModal && (
          <MessageTalentModal applicant={applicant} onClose={closeMessageModal} />
        )}
      </div>
    </div>
  );
}
