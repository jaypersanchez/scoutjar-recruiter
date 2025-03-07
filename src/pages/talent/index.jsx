import React, { useState } from "react";
import "@/common/styles/App.css";
import TalentDashboard from "./TalentDashboard";

export default function TalentPage({ user }) {
  return (
    <div className="App">
      <TalentDashboard user={user} />
    </div>
  );
}
