import React from "react";
import { useState } from "react";
import "@/common/styles/App.css";
import TalentSidebar from "./TalentSidebar";
import SearchForJob from "./sidebar-components/job-search";
import ApplyForJob from "./sidebar-components/apply-for-jobs";
import { FlexBox } from "@/common/components/flexbox";

// Import your sidebar components – these should be created in a similar fashion to your recruiter sidebar-components.

function TalentDashboard() {
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
    <FlexBox className="gap-8">
      <TalentSidebar setSelectedSection={setSelectedSection} />
      <div>{renderSection()}</div>
    </FlexBox>
  );
}

export default TalentDashboard;
