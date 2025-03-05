import React, { useState } from 'react';
import '../../../../App.css';

function ApplicantFilter({ onFilter }) {
  const [email, setEmail] = useState('');
  const [talentId, setTalentId] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the filter values to the parent.
    onFilter({ 
      email: email.trim(), 
      talent_id: talentId.trim(),
      job_id: jobId.trim(),
      job_title: jobTitle.trim()
    });
  };

  return (
    <div className="talent-filter-container">
      <h2 className="form-title">Filter Applicants</h2>
      <form onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="email">Email:</label>
            <input 
              type="text" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input"
              placeholder="Enter email"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="talentId">Talent ID:</label>
            <input 
              type="text" 
              id="talentId" 
              value={talentId} 
              onChange={(e) => setTalentId(e.target.value)} 
              className="form-input"
              placeholder="Enter Talent ID"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="jobId">Job ID:</label>
            <input 
              type="text" 
              id="jobId" 
              value={jobId} 
              onChange={(e) => setJobId(e.target.value)} 
              className="form-input"
              placeholder="Enter Job ID"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="jobTitle">Job Title:</label>
            <input 
              type="text" 
              id="jobTitle" 
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)} 
              className="form-input"
              placeholder="Enter Job Title"
            />
          </div>
        </div>
        <div className="filter-buttons">
          <button type="submit" className="form-button">Search</button>
        </div>
      </form>
    </div>
  );
}

export default ApplicantFilter;
