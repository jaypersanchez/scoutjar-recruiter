import React, { useState } from 'react';
import '@/common/styles/App.css'; // Ensure that this file is correctly imported

const JobPostingForm = ({ recruiterId, onSubmit }) => {
  const [formData, setFormData] = useState({
    job_title: '',
    job_description: '',
    required_skills: '', // comma-separated list; can be split before sending to API
    experience_level: '',
    employment_type: 'Full-time',
    salary_min: '',
    salary_max: '',
    work_mode: 'Remote',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare jobData object to match the API request body
    const jobData = {
      recruiter_id: recruiterId,
      job_title: formData.job_title,
      job_description: formData.job_description,
      required_skills: formData.required_skills.split(',').map(skill => skill.trim()),
      experience_level: formData.experience_level,
      employment_type: formData.employment_type,
      salary_range: [
        formData.salary_min ? parseFloat(formData.salary_min) : null,
        formData.salary_max ? parseFloat(formData.salary_max) : null
      ],
      work_mode: formData.work_mode,
      location: formData.location
      // date_posted will default to CURRENT_TIMESTAMP on the database side
    };

    try {
      // Post the job details to the server API
      const response = await fetch("http://localhost:5000/jobs", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Job posted successfully:', data);
        // Optionally, invoke the onSubmit callback to update parent state
        if (onSubmit) onSubmit(data);
      } else {
        console.error('Error posting job:', data);
      }
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="job_title">Job Title</label>
          <input
            type="text"
            id="job_title"
            name="job_title"
            className="form-input"
            value={formData.job_title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="job_description">Job Description</label>
          <textarea
            id="job_description"
            name="job_description"
            className="form-input"
            value={formData.job_description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="required_skills">Required Skills (comma-separated)</label>
          <input
            type="text"
            id="required_skills"
            name="required_skills"
            className="form-input"
            value={formData.required_skills}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="experience_level">Experience Level</label>
          <input
            type="text"
            id="experience_level"
            name="experience_level"
            className="form-input"
            value={formData.experience_level}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="employment_type">Employment Type</label>
          <select
            id="employment_type"
            name="employment_type"
            className="form-input"
            value={formData.employment_type}
            onChange={handleChange}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Salary Range</label>
          <div className="salary-range-inputs">
            <input
              type="number"
              step="0.01"
              name="salary_min"
              className="form-input salary-input"
              placeholder="Min"
              value={formData.salary_min}
              onChange={handleChange}
            />
            <input
              type="number"
              step="0.01"
              name="salary_max"
              className="form-input salary-input"
              placeholder="Max"
              value={formData.salary_max}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="work_mode">Work Mode</label>
          <select
            id="work_mode"
            name="work_mode"
            className="form-input"
            value={formData.work_mode}
            onChange={handleChange}
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-input"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="form-button">Post Job</button>
      </form>
    </div>
  );
};

export default JobPostingForm;
