import React, { useState } from "react";
import "@/common/styles/App.css";
import TalentSidebar from "@/pages/talent/TalentSidebar";

import SearchForJob from "./sidebar-components/job-search";
import ApplyForJob from "./sidebar-components/apply-for-jobs";

// Import your sidebar components – these should be created in a similar fashion to your recruiter sidebar-components.

function TalentDashboard({ user }) {
  const [selectedSection, setSelectedSection] = useState("Search for Job");

  const renderSection = () => {
    switch (selectedSection) {
      case "Search for Job":
        return <SearchForJob />;
      case "Apply for Job":
        return <ApplyForJob />;
      default:
        return <SearchForJob />;
    }
  };

  return (
    <div className="talent-dashboard">
      {/* <nav className="navbar">
        <div className="logo">
          <img src={scoutjarLogo} alt="ScoutJar Logo" className="scoutjar-logo" />
        </div>
        <ul className="nav-links">
          <li><span>Messages</span></li>
          <li><span>Profile</span></li>
          <li><a href="/">Sign Out</a></li>
        </ul>
      </nav> */}

      <div className="">
        {/* <TalentSidebar setSelectedSection={setSelectedSection} /> */}
        <div className="">{renderSection()}</div>
      </div>
    </div>
  );
}

export default TalentDashboard;
