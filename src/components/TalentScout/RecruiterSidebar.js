import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

function RecruiterSidebar() {
  return (
    <aside className="recruiter-sidebar">
      <ul>
        <li><Link to="#">Scout for Talent</Link></li>
        <li><Link to="#">Post a Job</Link></li>
        <li><Link to="#">Review Candidates</Link></li>
        <li><Link to="#">Shortlist Candidates</Link></li>
        <li><Link to="#">Schedule Interview</Link></li>
        <li><Link to="#">Interview Candidates</Link></li>
        <li><Link to="#">Evaluate Candidates</Link></li>
        <li><Link to="#">Send Job Offer</Link></li>
        <li><Link to="#">Reject Candidates</Link></li>
        <li><Link to="#">Finalize Hiring</Link></li>
        <li><Link to="#">Onboard Candidate</Link></li>
      </ul>
    </aside>
  );
}

export default RecruiterSidebar;
