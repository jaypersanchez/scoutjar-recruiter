import React, { useState } from 'react';
import '../../App.css';

function Talent({ user }) {
  const [status, setStatus] = useState('');

  const handleApplyJob = () => {
    setStatus('You have applied for a job.');
  };

  const handleAttendInterview = () => {
    setStatus('You have attended an interview.');
  };

  const handleAcceptOffer = () => {
    setStatus('You have accepted the job offer.');
  };

  const handleDeclineOffer = () => {
    setStatus('You have declined the job offer.');
  };

  return (
    <div className="App">
      <div className="content">
        <h1>Welcome, Talent!</h1>
        <p>{user ? `Hello, ${user.displayName}` : "Loading..."}</p>
        <p>Find exciting job opportunities that match your skills.</p>
        
        <button onClick={handleApplyJob}>Apply for Job</button>
        <button onClick={handleAttendInterview}>Attend Interview</button>
        <button onClick={handleAcceptOffer}>Accept Job Offer</button>
        <button onClick={handleDeclineOffer}>Decline Job Offer</button>
        
        {status && <p>Status: {status}</p>}
      </div>
    </div>
  );
}

export default Talent;

