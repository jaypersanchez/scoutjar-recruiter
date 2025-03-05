import React from "react";
import "@/common/styles/App.css";

function RecruiterSidebar({ setSelectedSection }) {
  return (
    <aside className="recruiter-sidebar">
      <ul>
        {[
          "Scout for Talent",
          "Post a Job",
          "My Job Posts",
          "Review Candidates",
          "Shortlist Candidates",
          "Schedule Interview",
          "Interview Candidates",
          "Evaluate Candidates",
          "Send Job Offer",
          "Reject Candidates",
          "Finalize Hiring",
          "Onboard Candidate",
        ].map((item) => (
          <li key={item}>
            <button
              className="sidebar-button"
              onClick={() => setSelectedSection(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default RecruiterSidebar;
