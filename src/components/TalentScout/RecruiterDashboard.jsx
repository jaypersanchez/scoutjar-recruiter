import React, { useState } from 'react';
import '../../App.css';
import scoutjarLogo from '../../assets/images/scoutjar_logo_header_bg.png';
import RecruiterSidebar from './RecruiterSidebar';

// Import Components
import ScoutForTalent from './sidebar-components/ScoutForTalent';
import PostJob from './sidebar-components/PostJob';
import ReviewCandidates from './sidebar-components/ReviewCandidates';
import ShortlistCandidates from './sidebar-components/ShortlistCandidates';
import ScheduleInterview from './sidebar-components/ScheduleInterview';
import InterviewCandidates from './sidebar-components/InterviewCandidates';
import EvaluateCandidates from './sidebar-components/EvaluateCandidates';
import SendJobOffer from './sidebar-components/SendJobOffer';
import RejectCandidates from './sidebar-components/RejectCandidates';
import FinalizeHiring from './sidebar-components/FinalizeHiring';
import OnboardCandidate from './sidebar-components/OnboardCandidate';
import MyJobPosts from './sidebar-components/PostJob/MyJobPosts'; // Import your MyJobPosts component

function RecruiterDashboard({ user }) {
  const [selectedSection, setSelectedSection] = useState("Scout for Talent");

  // Function to render the correct component
  const renderSection = () => {
    switch (selectedSection) {
      case "Scout for Talent":
        return <ScoutForTalent />;
      case "Post a Job":
        return <PostJob />;
      case "My Job Posts":
        return <MyJobPosts />; // Make sure user.recruiterId exists
      case "Review Candidates":
        return <ReviewCandidates />;
      case "Shortlist Candidates":
        return <ShortlistCandidates />;
      case "Schedule Interview":
        return <ScheduleInterview />;
      case "Interview Candidates":
        return <InterviewCandidates />;
      case "Evaluate Candidates":
        return <EvaluateCandidates />;
      case "Send Job Offer":
        return <SendJobOffer />;
      case "Reject Candidates":
        return <RejectCandidates />;
      case "Finalize Hiring":
        return <FinalizeHiring />;
      case "Onboard Candidate":
        return <OnboardCandidate />;
      default:
        return <ScoutForTalent />;
    }
  };

  return (
    <div className="recruiter-dashboard">
      <nav className="navbar">
        <div className="logo">
          <img src={scoutjarLogo} alt="ScoutJar Logo" className="scoutjar-logo" />
        </div>
        <ul className="nav-links">
          <li><span>Messages</span></li>
          <li><span>Profile</span></li>
          <li><a href="/">Sign Out</a></li>
        </ul>
      </nav>

      <div className="dashboard-wrapper">
        <RecruiterSidebar setSelectedSection={setSelectedSection} />
        <div className="recruiter-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
