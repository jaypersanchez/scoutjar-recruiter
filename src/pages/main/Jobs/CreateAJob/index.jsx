import React, { useState, useEffect } from "react";
import "@/common/styles/App.css";

export default function CreateAJob() {
  const storedUser = sessionStorage.getItem("sso-login");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const recruiterId = user ? user.recruiter_id : null;

  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    required_skills: "",
    experience_level: "",
    employment_type: "Full-time",
    salary_min: "",
    salary_max: "",
    work_mode: "Remote",
    locations: [],
  });

  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [filteredLocationOptions, setFilteredLocationOptions] = useState([]);
  const [suggestedSkills, setSuggestedSkills] = useState("");
  const [loadingSuggestSkills, setLoadingSuggestSkills] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;
  const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}`;

  useEffect(() => {
    fetch(`${baseUrl}/job-titles`)
      .then((res) => res.json())
      .then((data) => setJobTitleOptions(data))
      .catch((err) => console.error("Error fetching job titles:", err));
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/locations/all`)
      .then((res) => res.json())
      .then((data) => {
        setLocationOptions(data);
        setFilteredLocationOptions(data);
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*const handleJobTitleSelect = (e) => {
    const selectedId = e.target.value;
    const selectedOption = jobTitleOptions.find(
      (option) => String(option.job_title_id) === selectedId
    );
    setFormData((prev) => ({
      ...prev,
      job_title: selectedOption ? selectedOption.job_title : "",
      job_description: selectedOption ? selectedOption.job_description : "",
    }));
  };*/

  const handleJobTitleSelect = async (e) => {
    const selectedId = e.target.value;
    const selectedOption = jobTitleOptions.find(
      (option) => String(option.job_title_id) === selectedId
    );
  
    const title = selectedOption?.job_title || "";
    const desc = selectedOption?.job_description || "";
  
    // Set initial values from database
    setFormData((prev) => ({
      ...prev,
      job_title: title,
      job_description: desc
    }));
  
    // 🚀 Now fetch enhanced AI-based prefill values
    try {
      const response = await fetch(`${AIbaseUrl}/prefill-job-from-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: title,
          job_description: desc
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          job_description: data.job_description || prev.job_description,
          required_skills: data.required_skills || "",
          experience_level: data.experience_level || "",
          work_mode: data.work_mode || "",
          employment_type: data.employment_type || "",
          salary_min: data.salary_min || "",
          salary_max: data.salary_max || ""
        }));
      } else {
        console.error("Failed to prefill fields:", data);
      }
    } catch (error) {
      console.error("Prefill API error:", error);
    }
  };
  

  const handleLocationToggle = (location) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((loc) => loc !== location)
        : [...prev.locations, location],
    }));
  };

  const handleLocationSearch = (input) => {
    setLocationSearchInput(input);
    const lowerInput = input.toLowerCase();
    const filtered = locationOptions.filter((loc) =>
      loc.label.toLowerCase().includes(lowerInput)
    );
    setFilteredLocationOptions(filtered);
  };

  const handleSuggestSkills = async () => {
    if (!formData.job_title && !formData.job_description) {
      alert("Please enter Job Title and/or Description first.");
      return;
    }

    setLoadingSuggestSkills(true);

    try {
      const response = await fetch(`${AIbaseUrl}/suggest-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: formData.job_title,
          job_description: formData.job_description
        })
      });

      const data = await response.json();
      if (response.ok && data.suggested_skills) {
        setSuggestedSkills(data.suggested_skills);
      } else {
        console.error("Error suggesting skills:", data);
        alert("Failed to suggest skills.");
      }
    } catch (error) {
      console.error("Error suggesting skills:", error);
      alert("Failed to suggest skills.");
    } finally {
      setLoadingSuggestSkills(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const location = formData.locations.length > 0
      ? formData.locations.join("; ")
      : "";

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
    };

    try {
      const response = await fetch(`${baseUrl}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Job posted successfully:", data);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);

        // Reset form after posting
        setFormData({
          job_title: "",
          job_description: "",
          required_skills: "",
          experience_level: "",
          employment_type: "Full-time",
          salary_min: "",
          salary_max: "",
          work_mode: "Remote",
          locations: [],
        });
      } else {
        console.error("Error posting job:", data);
      }
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-10 uppercase text-center text-primary">
        Create a New Job with AI
      </h2>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white font-semibold px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce">
          ✅ Job posted successfully! View it in Job Listings or My Jobs.
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-job-form grid-2">

        {/* Job Title */}
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <select
            id="job_title"
            name="job_title"
            className="form-input"
            value={jobTitleOptions.find(
              (option) => option.job_title === formData.job_title
            )?.job_title_id || ""}
            onChange={handleJobTitleSelect}
            required
          >
            <option value="">Select a job title</option>
            {jobTitleOptions.map((option) => (
              <option key={option.job_title_id} value={option.job_title_id}>
                {option.job_title}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description */}
        <div className="form-group full-span">
          <label className="form-label">Job Description</label>
          <textarea
            name="job_description"
            className="form-input"
            value={formData.job_description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Add job responsibilities, requirements, etc."
          ></textarea>
        </div>

        {/* Required Skills */}
        <div className="form-group">
          <label className="form-label">Required Skills (comma-separated)</label>
          <input
            type="text"
            name="required_skills"
            className="form-input"
            value={formData.required_skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, SQL"
          />

          {/* Suggest Skills Button */}
          <button
            type="button"
            className="form-button mt-2"
            onClick={handleSuggestSkills}
            disabled={loadingSuggestSkills}
          >
            {loadingSuggestSkills ? "Loading..." : "Suggest Skills with AI"}
          </button>

          {/* Show Suggested Skills */}
          {suggestedSkills && (
            <div className="mt-2 text-gray-600">
              <div><strong>Suggested:</strong> {suggestedSkills}</div>
              <button
                type="button"
                className="form-button mt-1"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, required_skills: suggestedSkills }))
                }
              >
                Accept Suggested Skills
              </button>
            </div>
          )}
        </div>

        {/* Experience Level */}
        <div className="form-group">
          <label className="form-label">Experience Level</label>
          <select
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
          <label className="form-label">Employment Type</label>
          <select
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
          <label className="form-label">Work Mode</label>
          <select
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

        {/* Locations Multi-Select */}
        <div className="form-group full-span">
          <label className="form-label">Select Locations</label>
          <input
            type="text"
            placeholder="Search locations..."
            value={locationSearchInput}
            onChange={(e) => handleLocationSearch(e.target.value)}
            className="form-input mb-2"
          />
          <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            {filteredLocationOptions.map((loc, index) => (
              <label key={index} style={{ display: "block", marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  value={loc.label}
                  checked={formData.locations.includes(loc.label)}
                  onChange={() => handleLocationToggle(loc.label)}
                />
                {loc.label}
              </label>
            ))}
          </div>
          {formData.locations.length > 0 && (
            <div style={{ marginTop: "10px", fontSize: "0.9em", color: "gray" }}>
              Selected Locations: {formData.locations.join(", ")}
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="form-button mt-6">
          Post Job
        </button>

      </form>
    </div>
  );
}
