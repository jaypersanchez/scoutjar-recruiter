import React, { useState } from "react";

export default function TalentDetailModal({ applicant, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleShortlist = async () => {
    if (!window.confirm("Are you sure you want to shortlist this candidate?")) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/shortlisted-candidates/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiter_id: applicant.recruiter_id,
          talent_id: applicant.talent_id,
          job_id: applicant.job_id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Candidate shortlisted successfully!");
        onClose();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
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
            <span className="font-semibold">Application ID:</span>{" "}
            {applicant.application_id}
          </p>
          <p>
            <span className="font-semibold">Talent ID:</span> {applicant.talent_id}
          </p>
          <p>
            <span className="font-semibold">User ID:</span> {applicant.user_id}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {applicant.email}
          </p>
          {/* Additional fields (e.g., resume link, bio) can be added here */}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleShortlist}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Shortlisting..." : "Shortlist Candidate"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
