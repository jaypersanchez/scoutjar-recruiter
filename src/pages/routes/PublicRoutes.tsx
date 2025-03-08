import { PageRouteProps } from "@/common/types/routes.types";

// Public Routes
import DashboardPage from "@/pages/Public/Dashboard";
import TalentPage from "@/pages/Public/Talent";
import FinalizeHiringPage from "@/pages/Public/FinalizeHiring";
import ScoutForTalentPage from "@/pages/Public/ScoutForTalent";
import PostJobPage from "@/pages/Public/PostJob";
import SendJobOfferPage from "@/pages/Public/SendJobOffer";
import ScheduleInterviewPage from "@/pages/Public/ScheduleInterview";
import EvaluateCandidatesPage from "@/pages/Public/Candidates/EvaluateCandidates";

// Candidates Routes
import InterviewCandidatesPage from "@/pages/Public/Candidates/InterviewCandidates";
import OnboardCandidatesPage from "@/pages/Public/Candidates/OnboardCandidates";
import RejectCandidatesPage from "@/pages/Public/Candidates/RejectCandidates";
import ReviewCandidatesPage from "@/pages/Public/Candidates/ReviewCandidates";
import ShortlistCandidatesPage from "@/pages/Public/Candidates/ShortlistCandidates";

// User Routes
import ProfilePage from "@/pages/Public/Users/Profile";

import {
  RiDashboardFill,
  RiCalendarScheduleFill,
  RiUserSearchFill,
} from "react-icons/ri";
import { PiListDashesFill } from "react-icons/pi";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { MdPersonSearch, MdNoteAdd } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import {
  FaUserGroup,
  FaUserCheck,
  FaUserMinus,
  FaListCheck,
} from "react-icons/fa6";
import { FaUserFriends, FaUserCircle } from "react-icons/fa";

const PAGE_ROUTES: Array<PageRouteProps> = [
  {
    id: "public",
    path: "/",
    children: [
      {
        index: true,
        label: "Dashboard",
        icon: RiDashboardFill,
        Component: DashboardPage,
        hidden: true,
      },
      {
        index: true,
        // path: "scout-for-talent",
        label: "Scout for Talent",
        icon: MdPersonSearch,
        Component: ScoutForTalentPage,
        hidden: false,
      },
      {
        path: "talent",
        label: "Talent",
        icon: PiListDashesFill,
        Component: TalentPage,
        hidden: true,
      },
      {
        path: "finalize-hiring",
        label: "Finalize Hiring",
        icon: BsFillPersonCheckFill,
        Component: FinalizeHiringPage,
        hidden: true,
      },
      {
        path: "post-a-job",
        label: "Post A Job",
        icon: MdNoteAdd,
        Component: PostJobPage,
        hidden: false,
      },
      {
        path: "send-job-offer",
        label: "Send Job Offer",
        icon: IoIosMail,
        Component: SendJobOfferPage,
        hidden: true,
      },
      {
        path: "schedule-interview",
        label: "Schedule Interview",
        icon: RiCalendarScheduleFill,
        Component: ScheduleInterviewPage,
        hidden: true,
      },
    ],
  },

  // Candidates Routes
  {
    id: "candidates",
    path: "candidates",
    parentId: "public",
    icon: FaUserFriends,
    children: [
      {
        path: "interview",
        label: "Interview Candidates",
        icon: FaUserGroup,
        Component: InterviewCandidatesPage,
        hidden: true,
      },
      {
        path: "evaluate",
        label: "Evaluate Candidates",
        icon: RiUserSearchFill,
        Component: EvaluateCandidatesPage,
        hidden: true,
      },
      {
        path: "onboard",
        label: "Onboard Candidates",
        icon: FaUserCheck,
        Component: OnboardCandidatesPage,
        hidden: true,
      },
      {
        path: "reject",
        label: "Reject Candidates",
        icon: FaUserMinus,
        Component: RejectCandidatesPage,
        hidden: true,
      },
      {
        path: "review",
        label: "Review Candidates",
        icon: MdPersonSearch,
        Component: ReviewCandidatesPage,
        hidden: false,
      },
      {
        path: "shortlist",
        label: "Shortlist Candidates",
        icon: FaListCheck,
        Component: ShortlistCandidatesPage,
        hidden: true,
      },
    ],
  },

  // User Routes
  {
    id: "user",
    path: "user",
    children: [
      {
        path: "profile",
        label: "Profile",
        icon: FaUserCircle,
        Component: ProfilePage,
        hidden: false,
      },
    ],
  },
];

export default PAGE_ROUTES;
