import React, { useState } from "react";
import "@/common/styles/App.css";

export default function TalentPage({ user }) {
  return (
    <div className="App">
      <TalentDashboard user={user} />
    </div>
  );
}
