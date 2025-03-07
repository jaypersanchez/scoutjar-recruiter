import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/common/lib/utils";

import { Button } from "@/common/components/ui";
import { FlexBetween, FlexBox } from "@/common/components/flexbox";
import { GiHamburgerMenu } from "react-icons/gi";

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
        "sticky top-0 z-40 flex items-center px-6 desktop:px-10 min-h-16 bg-white border-b border-neutral-300",
        className
      )}
    >
      <FlexBetween className="w-full">
        <FlexBox className="gap-4 desktop:hidden">
          <Button
            size="icon"
            className={cn("h-8 w-8 shadow-none")}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <GiHamburgerMenu className={cn("w-5 h-5")} />
          </Button>
          <img
            className="h-12 cursor-pointer"
            src="/logo.png"
            onClick={() => navigate("/")}
          />
        </FlexBox>
      </FlexBetween>
    </header>
  );
}
