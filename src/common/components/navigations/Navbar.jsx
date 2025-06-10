import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/common/lib/utils";

import { Button } from "@/common/components/ui";
import { FlexBetween, FlexBox } from "@/common/components/flexbox";
import { GiHamburgerMenu } from "react-icons/gi";
import { UserMenu } from "@/common/components/navigations";

export default function Navbar({ className }) {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.setAttribute("data-disable-scroll", "1");
    } else {
      document.body.removeAttribute("data-disable-scroll");
    }
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 w-full flex items-center px-6 lg:px-10 min-h-16 bg-secondary border-b border-gray-200",
        className
      )}
    >
      <FlexBetween className="w-full flex-1">
        <FlexBox className="gap-4 lg:hidden">
          <Button
            size="icon"
            className={cn("h-8 w-8 shadow-none")}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <GiHamburgerMenu className={cn("w-5 h-5")} />
          </Button>
          <FlexBox className="gap-2">
            <img
              className="h-8 cursor-pointer rounded-md"
              src="/recruiter/lookk.png"
              onClick={() => navigate("/")}
            />
            <p className="text-xl font-bold leading-9 uppercase tracking-tight text-center text-gray-600 lg:text-start">
              LooKK
            </p>
          </FlexBox>
        </FlexBox>
        <UserMenu />
      </FlexBetween>
    </header>
  );
}
