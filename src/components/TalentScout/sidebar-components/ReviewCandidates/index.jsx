import React, { useState } from 'react';
import RecruiterSidebar from '../../RecruiterSidebar';
import JobApplicants from './JobApplicants';
import ReviewCandidates from './JobApplicants'; // if needed for other display

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('Review Candidates');

  // Render component based on selectedSection value
  let content;
  if (selectedSection === 'Review Candidates') {
    // Render the JobApplicants component instead of the default ReviewCandidates screen
    content = <JobApplicants />;
  } else if (selectedSection === 'Scout for Talent') {
    // Render another component for scouting talent if needed
    content = <div>Scout for Talent Component</div>;
  } else {
    // Render default or other components
    content = <ReviewCandidates />;
  }

  return (
    <div className="dashboard-wrapper">
      <RecruiterSidebar setSelectedSection={setSelectedSection} />
      <main className="recruiter-content">
        {content}
      </main>
    </div>
  );
}

export default Dashboard;
