import React from 'react';
import '../../App.css';

function RecruiterDashboard({ user }) {
  return (
    <div className="recruiter-container">
      <h1>Welcome, Recruiter!</h1>
      <p>{user ? `Hello, ${user.displayName}` : "Loading..."}</p>
      
      <div className="actions">
        <button className="btn">Scout for Talent</button>
        <button className="btn">Post a Job</button>
        <button className="btn">Review Candidates</button>
        <button className="btn">Shortlist Candidates</button>
        <button className="btn">Schedule Interview</button>
        <button className="btn">Interview Candidates</button>
        <button className="btn">Evaluate Candidates</button>
        <button className="btn">Send Job Offer</button>
        <button className="btn">Reject Candidates</button>
        <button className="btn">Finalize Hiring</button>
        <button className="btn">Onboard Candidate</button>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
