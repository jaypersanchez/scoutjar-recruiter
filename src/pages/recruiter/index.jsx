import React, { useState } from "react";
import "@/common/styles/App.css";
import scoutjarLogo from "../../assets/images/scoutjar_logo_header_bg.png";
import RecruiterSidebar from "../../components/TalentScout/RecruiterSidebar";

// Import Components
import ScoutForTalent from "../../components/TalentScout/sidebar-components/ScoutForTalent";
import PostJob from "../../components/TalentScout/sidebar-components/PostJob";
import ReviewCandidates from "../../components/TalentScout/sidebar-components/ReviewCandidates";
import ShortlistCandidates from "../../components/TalentScout/sidebar-components/ShortlistCandidates";
import ScheduleInterview from "../../components/TalentScout/sidebar-components/ScheduleInterview";
import InterviewCandidates from "../../components/TalentScout/sidebar-components/InterviewCandidates";
import EvaluateCandidates from "../../components/TalentScout/sidebar-components/EvaluateCandidates";
import SendJobOffer from "../../components/TalentScout/sidebar-components/SendJobOffer";
import RejectCandidates from "../../components/TalentScout/sidebar-components/RejectCandidates";
import FinalizeHiring from "../../components/TalentScout/sidebar-components/FinalizeHiring";
import OnboardCandidate from "../../components/TalentScout/sidebar-components/OnboardCandidate";
import MyJobPosts from "../../components/TalentScout/sidebar-components/PostJob/MyJobPosts"; // Import your MyJobPosts component
import { FlexBox } from "@/common/components/flexbox";

export default function RecruiterPage({ user }) {
  const [selectedSection, setSelectedSection] = useState("Scout for Talent");

  // Function to render the correct component
  const renderSection = () => {
    switch (selectedSection) {
      case "Scout for Talent":
        return <ScoutForTalent />;
      case "Post a Job":
        return <PostJob />;
      case "Scout's Job Posts":
        return <MyJobPosts />; // Make sure user.recruiterId exists
      case "Review Talent Applicants":
        return <ReviewCandidates />;
      case "ScoutJar Talents":
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
    <div>
      {/* <nav className="navbar">
        <div className="logo">
          <img
            src={scoutjarLogo}
            alt="ScoutJar Logo"
            className="scoutjar-logo"
          />
        </div>
        <ul className="nav-links">
          <li>
            <span>Messages</span>
          </li>
          <li>
            <span>Profile</span>
          </li>
          <li>
            <a href="/auth">Sign Out</a>
          </li>
        </ul>
      </nav> */}

      <FlexBox className="items-start gap-2">
        <RecruiterSidebar setSelectedSection={setSelectedSection} />
        <div className="w-full">
          <div>{renderSection()}</div>
        </div>
      </FlexBox>
    </div>
  );
}
