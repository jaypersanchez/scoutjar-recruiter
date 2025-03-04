// TalentFilter.js
import React, { useState } from 'react';
import '../../../../App.css'; // Ensure the correct path to your App.css

function TalentFilter({ onResults }) {
  // Local state for filter fields
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');

  // Function to execute the query using filters
  const handleExecuteQuery = async () => {
    const filterData = {
      min_salary: minSalary ? parseFloat(minSalary) : 0,
      max_salary: maxSalary ? parseFloat(maxSalary) : null,
      filter_location: location || null,
      required_skill: skills || null
    };

    console.log("Sending API Request with:", filterData);

    try {
      const response = await fetch('http://localhost:5000/talent-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData),
      });

      const data = await response.json();
      console.log("API Response Received:", data);

      onResults(data || []);
    } catch (error) {
      console.error('Error executing query:', error);
      alert('Error executing query.');
    }
  };

  // Function to reset filter fields
  const handleClearFilters = () => {
    setMinSalary(0);
    setMaxSalary(0);
    setLocation('');
    setSkills('');
    console.log("🔹 Filters cleared.");
  };

  return (
    <div className="talent-filter-container">
      <h2>Talent Filter</h2>
      <form>
        <div className="filter-row">
          <div className="filter-field">
            <label>Minimum Salary:</label>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <div className="filter-field">
            <label>Maximum Salary:</label>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              placeholder="e.g. 80000"
            />
          </div>
          <div className="filter-field">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York"
            />
          </div>
          <div className="filter-field">
            <label>Skills:</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Enter required skill"
            />
          </div>
        </div>
      </form>
      <div className="filter-buttons">
        <button type="button" onClick={handleExecuteQuery}>
          Query for Talents
        </button>
        <button type="button" onClick={handleClearFilters} className="clear-button">
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default TalentFilter;
