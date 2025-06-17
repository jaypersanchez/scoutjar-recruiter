// At the top of the file
/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import TalentFilter from "./TalentFilter";
import TalentResults from "./TalentResults";
import TalentDisplaySwitcher from "./TalentDisplaySwitcher";

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
      {/*<TalentFilter onResults={handleResults} />*/}
      <TalentFilter onResults={setResults} />
      <TalentDisplaySwitcher results={results} />
    </div>
  );
}
