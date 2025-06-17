// src/routes.jsx
console.log("1")
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import  { RootLayout }  from "@/common/components/layouts";
console.log("2")
// ✅ Auth Pages
import LoginPage from "@/pages/LoginPage";
import ResetPassword from "@/pages/ResetPassword";
import ResetPasswordToken from "@/pages/ResetPasswordToken";
console.log("3")
// ✅ Main Pages
console.log("scouttalent")
import ScoutForTalent from "@/pages/main/ScoutForTalent";
console.log("scouttalent again")
console.log("DASHBOARD")
import Dashboard from "@/pages/main/Dashboard";
console.log("DASHBOARD AGAIN")

import Talent from "@/pages/main/Talent";
import FinalizeHiring from "@/pages/main/FinalizeHiring";
import SendJobOffer from "@/pages/main/SendJobOffer";
import ScheduleInterview from "@/pages/main/ScheduleInterview";

import CreateAJob from "@/pages/main/Jobs/CreateAJob";
import JobsPosted from "@/pages/main/Jobs/JobsPosted";

import InterviewCandidates from "@/pages/main/Candidates/InterviewCandidates";
import EvaluateCandidates from "@/pages/main/Candidates/EvaluateCandidates";
import OnboardCandidates from "@/pages/main/Candidates/OnboardCandidates";
import RejectCandidates from "@/pages/main/Candidates/RejectCandidates";
import ReviewCandidates from "@/pages/main/Candidates/ReviewCandidates";
import ShortlistCandidates from "@/pages/main/Candidates/ShortlistCandidates";
import Profile from "@/pages/main/Users/Profile";

console.log("✅ ROUTE COMPONENTS CHECK");
console.log("RootLayout", RootLayout);
console.log("LoginPage", LoginPage);
console.log("ResetPassword", ResetPassword);
console.log("ResetPasswordToken", ResetPasswordToken);
console.log("Dashboard", Dashboard);
console.log("ScoutForTalent", ScoutForTalent);


const Routers = createBrowserRouter(
  [
    {
      path: "/recruiter",
      element: <RootLayout />,
      //errorElement: <Page404 />,
      children: [
        //{ index: true, element: <Navigate to="/dashboard" /> },
        { index: true, element: <Navigate to="login" /> },
        { path: "login", element: <LoginPage /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "reset-password/:token", element: <ResetPasswordToken /> },

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

        { path: "user/profile", element: <Profile /> },
      ],
    },
  ],
  
);

export default Routers;
