import React from 'react';
import '../../App.css';

function RecruiterSidebar({ setSelectedSection }) {
  const items = [
    "Scout for Talent",
    "Post a Job",
    "Scout's Job Posts",
    "Review Talent Applicants",
    "ScoutJar Talents",
    "Schedule Interview",
    "Interview Candidates",
    "Evaluate Candidates",
    "Send Job Offer",
    "Reject Candidates",
    "Finalize Hiring",
    "Onboard Candidate"
  ];

  return (
    <aside className="recruiter-sidebar">
      <ul>
        {items.map((item, index) => (
          <li key={item} style={{ display: index < 5 ? 'list-item' : 'none' }}>
            <button className="sidebar-button" onClick={() => setSelectedSection(item)}>
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default RecruiterSidebar;
