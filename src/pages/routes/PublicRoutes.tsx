import { PageRouteProps } from "@/common/types/routes.types";

// Public Routes
import DashboardPage from "@/pages/main/Dashboard";
import TalentPage from "@/pages/main/Talent";
import FinalizeHiringPage from "@/pages/main/FinalizeHiring";
import ScoutForTalentPage from "@/pages/main/ScoutForTalent";
import SendJobOfferPage from "@/pages/main/SendJobOffer";
import ScheduleInterviewPage from "@/pages/main/ScheduleInterview";
import EvaluateCandidatesPage from "@/pages/main/Candidates/EvaluateCandidates";

// Jobs Routes
import CreateAJob from "@/pages/main/Jobs/CreateAJob";
import JobsPosted from "@/pages/main/Jobs/JobsPosted";

// Candidates Routes
import InterviewCandidatesPage from "@/pages/main/Candidates/InterviewCandidates";
import OnboardCandidatesPage from "@/pages/main/Candidates/OnboardCandidates";
import RejectCandidatesPage from "@/pages/main/Candidates/RejectCandidates";
import ReviewCandidatesPage from "@/pages/main/Candidates/ReviewCandidates";
import ShortlistCandidatesPage from "@/pages/main/Candidates/ShortlistCandidates";

// User Routes
import ProfilePage from "@/pages/main/Users/Profile";

import {
  RiDashboardFill,
  RiCalendarScheduleFill,
  RiUserSearchFill,
} from "react-icons/ri";
import { IoMdListBox } from "react-icons/io";
import { BsFillPersonCheckFill, BsFillBriefcaseFill } from "react-icons/bs";
import { MdPersonSearch, MdNoteAdd } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import {
  FaUserGroup,
  FaUserCheck,
  FaUserMinus,
  FaListCheck,
} from "react-icons/fa6";
import { PiListChecksFill } from "react-icons/pi";
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
        icon: IoMdListBox,
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

  // Jobs Routes
  {
    id: "jobs",
    path: "jobs",
    parentId: "public",
    icon: BsFillBriefcaseFill,
    children: [
      {
        path: "create",
        label: "Create",
        icon: MdNoteAdd,
        Component: CreateAJob,
        hidden: false,
      },
      {
        path: "posted",
        label: "Postings",
        icon: IoMdListBox,
        Component: JobsPosted,
        hidden: false,
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
        label: "Interview",
        icon: FaUserGroup,
        Component: InterviewCandidatesPage,
        hidden: true,
      },
      {
        path: "evaluate",
        label: "Evaluate",
        icon: RiUserSearchFill,
        Component: EvaluateCandidatesPage,
        hidden: true,
      },
      {
        path: "onboard",
        label: "Onboard",
        icon: FaUserCheck,
        Component: OnboardCandidatesPage,
        hidden: true,
      },
      {
        path: "reject",
        label: "Reject",
        icon: FaUserMinus,
        Component: RejectCandidatesPage,
        hidden: true,
      },
      {
        path: "review",
        label: "Review",
        icon: PiListChecksFill,
        Component: ReviewCandidatesPage,
        hidden: false,
      },
      {
        path: "shortlist",
        label: "Shortlist",
        icon: FaListCheck,
        Component: ShortlistCandidatesPage,
        hidden: false,
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

  // Nested Routes with dynamic paths
  // {
  //   id: "view-jobs",
  //   path: "view-jobs",
  //   parentId: "jobs",
  //   icon: BsFillBriefcaseFill,
  //   children: [
  //     {
  //       path: "view/:id", // This will be omitted from the navigation
  //       label: "View",
  //       icon: MdNoteAdd,
  //       Component: CreateAJob,
  //       hidden: false,
  //     },
  //   ],
  // },
];

export default PAGE_ROUTES;
