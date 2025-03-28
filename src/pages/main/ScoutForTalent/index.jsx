// At the top of the file
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import TalentFilter from "./TalentFilter";
import TalentResults from "./TalentResults";

export default function ScoutForTalentPage() {
  // State to hold the query results returned from the filter component
  const [results, setResults] = useState([]);

  // Callback that TalentFilter will call with its results
  const handleResults = (data) => {
    setResults(data);
  };

  return (
    <div>
      {/* Render the filter component and pass the callback */}
      <TalentFilter onResults={handleResults} />
      {/* Render the results component below the filter */}
      {/*<TalentResults results={results} />*/}
    </div>
  );
}
