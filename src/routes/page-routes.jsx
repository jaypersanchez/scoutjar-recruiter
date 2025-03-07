import { PageLayout } from "@/common/components/layouts";

import Dashboard from "@/pages/Dashboard";
import TalentPage from "@/pages/Talent";
import FinalizeHiring from "@/pages/FinalizeHiring";
import ScoutForTalent from "@/pages/ScoutForTalent";
import PostJob from "@/pages/PostJob";
import SendJobOffer from "@/pages/SendJobOffer";
import ScheduleInterview from "@/pages/ScheduleInterview";
import EvaluateCandidates from "@/pages/Candidates/EvaluateCandidates";
import InterviewCandidates from "@/pages/Candidates/InterviewCandidates";
import OnboardCandidates from "@/pages/Candidates/OnboardCandidates";
import RejectCandidates from "@/pages/Candidates/RejectCandidates";
import ReviewCandidates from "@/pages/Candidates/ReviewCandidates";
import ShortlistCandidates from "@/pages/Candidates/ShortlistCandidates";

const PageRoutes = {
  id: "main",
  path: "/",
  element: <PageLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "talent",
      element: <TalentPage />,
    },
    {
      path: "finalize-hiring",
      element: <FinalizeHiring />,
    },
    {
      path: "scout-for-talent",
      element: <ScoutForTalent />,
    },
    {
      path: "post-a-job",
      element: <PostJob />,
    },
    {
      path: "send-job-offer",
      element: <SendJobOffer />,
    },
    {
      path: "schedule-interview",
      element: <ScheduleInterview />,
    },
    {
      path: "evaluate-candidates",
      element: <EvaluateCandidates />,
    },
    {
      path: "interview-candidates",
      element: <InterviewCandidates />,
    },
    {
      path: "onboard-candidates",
      element: <OnboardCandidates />,
    },
    {
      path: "reject-candidates",
      element: <RejectCandidates />,
    },
    {
      path: "review-candidates",
      element: <ReviewCandidates />,
    },
    {
      path: "shortlist-candidates",
      element: <ShortlistCandidates />,
    },
  ],
};

export default PageRoutes;
