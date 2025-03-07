import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/common/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
} from "@/common/components/ui";
import { FlexBox, FlexCenter } from "@/common/components/flexbox";

import { FaAngleLeft } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";

const navigations = [
  {
    icon: MdDashboard,
    name: "Dashboard",
    link: "/",
  },
  {
    icon: MdDashboard,
    name: "Scout for Talent",
    link: "/scout-talent",
  },
  {
    icon: MdDashboard,
    name: "Post a Job",
    link: "/post-job",
  },
  {
    icon: MdDashboard,
    name: "Scout's Job Posts",
    link: "/my-job-posts",
  },
  {
    icon: MdDashboard,
    name: "Review Talent Applicants",
    link: "/review-applicants",
  },
  {
    icon: MdDashboard,
    name: "ScoutJar Talents",
    link: "/talents",
  },
  {
    icon: MdDashboard,
    name: "Schedule Interview",
    link: "/schedule-interview",
  },
  {
    icon: MdDashboard,
    name: "Interview Candidates",
    link: "/interview",
  },
  {
    icon: MdDashboard,
    name: "Evaluate Candidates",
    link: "/evaluate",
  },
  {
    icon: MdDashboard,
    name: "Send Job Offer",
    link: "/job-offer",
  },
  {
    icon: MdDashboard,
    name: "Reject Candidates",
    link: "/reject",
  },
  {
    icon: MdDashboard,
    name: "Finalize Hiring",
    link: "/finalize",
  },
  {
    icon: MdDashboard,
    name: "Onboard Candidate",
    link: "/onboard",
  },
];

export default function Sidebar({ className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWrapped, setWrapped] = useState(false);

  const parentLocation = `/${location.pathname.split("/").at(1).toString()}`;

  const isActive = (link) => {
    return location.pathname === link || parentLocation === link;
  };

  return (
    <aside
      className={cn(
        "hidden lg:block relative",
        isWrapped ? "w-[78px]" : "w-72"
      )}
    >
      <Button
        size="icon"
        className={cn(
          "fixed z-50 top-6 h-6 w-6 shadow-none rounded-sm",
          isWrapped ? "left-[72px]" : "left-[282px]"
        )}
        onClick={() => setWrapped(!isWrapped)}
      >
        <FaAngleLeft
          className={cn(
            "w-4 h-4",
            isWrapped ? "animate-in rotate-180" : "animate-out mr-0.5"
          )}
        />
      </Button>

      <div
        className={cn(
          "fixed h-full border-r border-gray-300 overflow-auto z-40 bg-secondary",
          isWrapped ? "w-[78px] px-2" : "w-72 px-4",
          className
        )}
      >
        <header
          className={cn(
            "flex flex-col justify-center w-full text-white",
            isWrapped ? "mt-4 mb-6" : "h-16"
          )}
        >
          <FlexCenter className={cn(!isWrapped && "justify-start")}>
            <FlexBox className="gap-2">
              <img
                className={cn("rounded-md", isWrapped ? "w-10" : "h-8")}
                src="/logo.png"
              />
              <p
                className={cn(
                  "text-xl font-bold leading-9 uppercase tracking-tight text-center text-gray-600 lg:text-start",
                  isWrapped ? "hidden" : "block"
                )}
              >
                ScoutJar
              </p>
            </FlexBox>
          </FlexCenter>
        </header>

        <TooltipProvider>
          <ul className="flex flex-col w-full gap-1 my-4">
            {navigations.map((nav, i) => (
              <Tooltip key={i}>
                <TooltipTrigger
                  className={cn(
                    "w-full font-semibold rounded-sm flex items-center",
                    // "disabled:opacity-75",
                    isWrapped
                      ? "flex-col text-[10px] p-1 w-11 min-h-11 mx-auto justify-center gap-0.5 text-center text-pretty"
                      : "flex-row gap-4 py-2 pl-4 pr-2 min-h-12 text-sm",
                    isActive(nav.link)
                      ? "bg-primary/20 text-primary hover:bg-primary/20 cursor-default"
                      : "hover:bg-primary/20 disabled:hover:bg-transparent disabled:cursor-default text-primary cursor-pointer"
                  )}
                  onClick={() =>
                    location.pathname !== nav.link && navigate(nav.link)
                  }
                  disabled
                >
                  <nav.icon className={cn(isWrapped ? "h-6 w-6" : "h-5 w-5")} />
                  <p className={cn(isWrapped ? "hidden" : "block")}>
                    {nav.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className={cn(isWrapped ? "block" : "hidden")}
                >
                  <p>{nav.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </ul>
        </TooltipProvider>
      </div>
    </aside>
  );
}
