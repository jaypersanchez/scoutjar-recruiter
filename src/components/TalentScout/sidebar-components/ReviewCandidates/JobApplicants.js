import React, { useState, useEffect } from 'react';
import '../../../../App.css';

function JobApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const response = await fetch('http://localhost:5000/job-applicants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}) // no parameter for now
        });
        if (!response.ok) {
          throw new Error('Error fetching applicants');
        }
        const data = await response.json();
        setApplicants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="job-posts-container">
      <h2>Job Applicants</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Talent ID</th>
            <th>User ID</th>
            <th>Job ID</th>
            <th>Job Title</th>
            <th>Recruiter ID</th>
            <th>Status</th>
            <th>Application Date</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(applicant => (
            <tr key={applicant.application_id}>
              <td>{applicant.application_id}</td>
              <td>{applicant.talent_id}</td>
              <td>{applicant.user_id}</td>
              <td>{applicant.job_id}</td>
              <td>{applicant.job_title}</td>
              <td>{applicant.recruiter_id}</td>
              <td>{applicant.application_status || 'Pending'}</td>
              <td>{new Date(applicant.application_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobApplicants;
