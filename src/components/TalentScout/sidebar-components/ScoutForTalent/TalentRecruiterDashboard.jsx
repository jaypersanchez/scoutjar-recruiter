// TalentRecruiterDashboard.js
import React, { useState } from 'react';
import TalentFilter from './TalentFilter';
import TalentResults from './TalentResults';
import '../../../../App.css'; // Ensure CSS is imported

function TalentRecruiterDashboard() {
  const [results, setResults] = useState([]);

  // This callback is passed to TalentFilter and called when query results are ready.
  const handleResults = (data) => {
    setResults(data);
  };

  return (
    <div className="talent-recruiter-dashboard">
      <TalentFilter onResults={handleResults} />
      <TalentResults results={results} />
    </div>
  );
}

export default TalentRecruiterDashboard;
