import React, { useEffect, useState } from 'react';
import '../../../../App.css';

const MyJobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Use the /jobs/get endpoint and send a POST request.
        // You can also add a recruiter_id in the body if needed.
        const response = await fetch('http://localhost:5000/jobs/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})  // Sending an empty object to fetch all jobs.
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading job posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="job-posts-container">
      <h2>My Job Posts</h2>
      {jobs.length === 0 ? (
        <p>No job posts found.</p>
      ) : (
        <ul className="job-posts-list">
          {jobs.map((job) => (
            <li key={job.job_id} className="job-post-item">
              <h3>{job.job_title}</h3>
              <p>{job.job_description}</p>
              {job.required_skills && job.required_skills.length > 0 && (
                <p><strong>Skills:</strong> {job.required_skills.join(', ')}</p>
              )}
              {job.experience_level && <p><strong>Experience Level:</strong> {job.experience_level}</p>}
              {job.employment_type && <p><strong>Employment Type:</strong> {job.employment_type}</p>}
              {job.salary_range && job.salary_range.length === 2 && (
                <p><strong>Salary Range:</strong> {job.salary_range[0]} - {job.salary_range[1]}</p>
              )}
              {job.work_mode && <p><strong>Work Mode:</strong> {job.work_mode}</p>}
              {job.location && <p><strong>Location:</strong> {job.location}</p>}
              {job.date_posted && (
                <p><strong>Date Posted:</strong> {new Date(job.date_posted).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyJobPosts;
