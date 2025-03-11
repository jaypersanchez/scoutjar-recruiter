import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";

export default function CreateAJob() {
  // Retrieve user info from sessionStorage (if needed)
  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;

  // Optional callback when the job is successfully posted
  const onSubmit = () => {
    console.log("Job posted successfully");
  };

  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    required_skills: "", // comma-separated list
    experience_level: "",  // Now selected from dropdown
    employment_type: "Full-time",
    salary_min: "",
    salary_max: "",
    work_mode: "Remote",
    country: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch the list of countries when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/locations/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // When a country is selected, update formData and fetch its cities
  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({ ...prev, country: selectedCountry, city: "" }));
    fetch(`http://localhost:5000/locations/cities?country=${selectedCountry}`)
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error fetching cities:", err));
  };

  // Standard change handler for other inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // When the form is submitted, build the job object and post it to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine city and country into a location string (if both are provided)
    const location =
      formData.city && formData.country
        ? `${formData.city}, ${formData.country}`
        : "";

    // Prepare jobData object to match the API request body
    const jobData = {
      recruiter_id: recruiterId,
      job_title: formData.job_title,
      job_description: formData.job_description,
      required_skills: formData.required_skills
        .split(",")
        .map((skill) => skill.trim()),
      experience_level: formData.experience_level,
      employment_type: formData.employment_type,
      salary_range: [
        formData.salary_min ? parseFloat(formData.salary_min) : null,
        formData.salary_max ? parseFloat(formData.salary_max) : null,
      ],
      work_mode: formData.work_mode,
      location: location,
      // date_posted will default to CURRENT_TIMESTAMP on the database side
    };

    try {
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Job posted successfully:", data);
        if (onSubmit) onSubmit(data);
      } else {
        console.error("Error posting job:", data);
      }
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-12 uppercase text-center text-primary">
        Create a new job
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="job_title">
            Job Title
          </label>
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

        {/* Job Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="job_description">
            Job Description
          </label>
          <textarea
            id="job_description"
            name="job_description"
            className="form-input"
            value={formData.job_description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Required Skills */}
        <div className="form-group">
          <label className="form-label" htmlFor="required_skills">
            Required Skills (comma-separated)
          </label>
          <input
            type="text"
            id="required_skills"
            name="required_skills"
            className="form-input"
            value={formData.required_skills}
            onChange={handleChange}
          />
        </div>

        {/* Experience Level (Updated to Select Dropdown) */}
        <div className="form-group">
          <label className="form-label" htmlFor="experience_level">
            Experience Level
          </label>
          <select
            id="experience_level"
            name="experience_level"
            className="form-input"
            value={formData.experience_level}
            onChange={handleChange}
            required
          >
            <option value="">Select experience level</option>
            <option value="Senior">Senior</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Junior">Junior</option>
          </select>
        </div>

        {/* Employment Type */}
        <div className="form-group">
          <label className="form-label" htmlFor="employment_type">
            Employment Type
          </label>
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

        {/* Salary Range */}
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

        {/* Work Mode */}
        <div className="form-group">
          <label className="form-label" htmlFor="work_mode">
            Work Mode
          </label>
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

        {/* Country Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="country">
            Country
          </label>
          <select
            id="country"
            name="country"
            className="form-input"
            value={formData.country}
            onChange={handleCountryChange}
            required
          >
            <option value="">Select a country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="city">
            City
          </label>
          <select
            id="city"
            name="city"
            className="form-input"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={!formData.country}
          >
            <option value="">Select a city</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="form-button">
          Post Job
        </button>
      </form>
    </div>
  );
}
