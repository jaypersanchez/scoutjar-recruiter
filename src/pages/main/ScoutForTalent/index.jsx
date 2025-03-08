import React, { useState } from "react";
import { useAuth } from "@/common/hooks";
import TalentFilter from "./TalentFilter";
import TalentResults from "./TalentResults";

export default function ScoutForTalentPage() {
  // State to hold the query results returned from the filter component
  const [results, setResults] = useState([]);
  const { user } = useAuth();

  // Callback that TalentFilter will call with its results
  const handleResults = (data) => {
    setResults(data);
  };

  return (
    <div>
      <p>{user ? `Welcome back, ${user.displayName}` : ""}</p>
      {/* Render the filter component and pass the callback */}
      <TalentFilter onResults={handleResults} />
      {/* Render the results component below the filter */}
      <TalentResults results={results} />
    </div>
  );
}
