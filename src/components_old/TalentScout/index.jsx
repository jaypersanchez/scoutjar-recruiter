import React from "react";
import "@/common/styles/App.css";

function TalentScout({ user }) {
  return (
    <div className="App">
      <div className="content">
        <h1>Welcome, Talent Scout!</h1>
        <p>{user ? `Hello, ${user.displayName}` : "Loading..."}</p>
        <p>Start searching for top talent today.</p>
      </div>
    </div>
  );
}

export default TalentScout;
