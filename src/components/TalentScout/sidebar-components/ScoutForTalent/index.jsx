import React, { useState } from 'react';
import '../../../../App.css';
import TalentFilter from './TalentFilter';
import TalentResults from './TalentResults';

function TalentScout({ user }) {
  // State to hold the query results returned from the filter component
  const [results, setResults] = useState([]);

  // Callback that TalentFilter will call with its results
  const handleResults = (data) => {
    setResults(data);
  };

  return (
    <div className="App">
      <div className="content">
        <p>{user ? `Welcome back, ${user.displayName}` : ""}</p>
        {/* Render the filter component and pass the callback */}
        <TalentFilter onResults={handleResults} />
        {/* Render the results component below the filter */}
        <TalentResults results={results} />
      </div>
    </div>
  );
}

export default TalentScout;
