// src/routes.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// ✅ Layouts
import { RootLayout } from "@/common/components/layouts";
import PageLayout from "@/common/components/layouts/PageLayout";

// ✅ Auth Pages
import LoginPage from "@/pages/LoginPage";
import ResetPassword from "@/pages/ResetPassword";
import ResetPasswordToken from "@/pages/ResetPasswordToken";

// ✅ Main Pages
import Dashboard from "@/pages/main/Dashboard";
import ScoutForTalent from "@/pages/main/ScoutForTalent";
import Talent from "@/pages/main/Talent";
import FinalizeHiring from "@/pages/main/FinalizeHiring";
import SendJobOffer from "@/pages/main/SendJobOffer";
import ScheduleInterview from "@/pages/main/ScheduleInterview";

// ✅ Jobs
import CreateAJob from "@/pages/main/Jobs/CreateAJob";
import JobsPosted from "@/pages/main/Jobs/JobsPosted";

// ✅ Candidates
import InterviewCandidates from "@/pages/main/Candidates/InterviewCandidates";
import EvaluateCandidates from "@/pages/main/Candidates/EvaluateCandidates";
import OnboardCandidates from "@/pages/main/Candidates/OnboardCandidates";
import RejectCandidates from "@/pages/main/Candidates/RejectCandidates";
import ReviewCandidates from "@/pages/main/Candidates/ReviewCandidates";
import ShortlistCandidates from "@/pages/main/Candidates/ShortlistCandidates";

// Legal 
import TermsAndConditions from "@/pages/legal/TermsAndConditions";

// ✅ User
import Profile from "@/pages/main/Users/Profile";

const Routers = createBrowserRouter([
  {
    path: "/recruiter",
    element: <RootLayout />, // Used for login/reset
    children: [
      { index: true, element: <Navigate to="login" /> },
      { path: "login", element: <LoginPage /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "reset-password/:token", element: <ResetPasswordToken /> },
      { path: "terms", element: <TermsAndConditions /> },

      // 👇 All authenticated routes wrapped in PageLayout
      {
        element: <PageLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "scout-for-talent", element: <ScoutForTalent /> },
          { path: "talent", element: <Talent /> },
          { path: "finalize-hiring", element: <FinalizeHiring /> },
          { path: "send-job-offer", element: <SendJobOffer /> },
          { path: "schedule-interview", element: <ScheduleInterview /> },

          { path: "jobs/create", element: <CreateAJob /> },
          { path: "jobs/posted", element: <JobsPosted /> },

          { path: "candidates/interview", element: <InterviewCandidates /> },
          { path: "candidates/evaluate", element: <EvaluateCandidates /> },
          { path: "candidates/onboard", element: <OnboardCandidates /> },
          { path: "candidates/reject", element: <RejectCandidates /> },
          { path: "candidates/review", element: <ReviewCandidates /> },
          { path: "candidates/shortlist", element: <ShortlistCandidates /> },

          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
]);

export default Routers;
