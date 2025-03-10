import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/common/lib/utils";
import PAGE_ROUTES from "@/pages/routes/PublicRoutes";
import { navigations } from "@/common/utils/fnRoutes";
import { Button } from "@/common/components/ui";
import { FlexBox } from "@/common/components/flexbox";

import { FaAngleLeft } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { cva } from "class-variance-authority";

const navItemVariants = cva(
  "w-full font-semibold rounded-sm flex items-center disabled:opacity-75 flex-row gap-4 py-2 pl-4 pr-2 min-h-12 text-sm hover:bg-primary/20 disabled:hover:bg-transparent disabled:cursor-default text-primary hover:text-tertiary cursor-pointer",
  {
    variants: {
      isWrapped: {
        true: "flex-col text-[10px] w-12 min-h-12 pr-4 pl-5 justify-center gap-0.5 text-center text-pretty group-hover:flex-row group-hover:gap-4 group-hover:py-2 group-hover:pl-4 group-hover:pr-2 group-hover:min-h-12 group-hover:text-sm group-hover:justify-start group-hover:mx-0 group-hover:w-full",
      },
      isActive: {
        true: "bg-primary/20 text-tertiary hover:bg-primary/20 cursor-default",
      },
      isCategory: {
        true: "bg-transparent text-primary hover:bg-transparent hover:text-tertiary",
      },
    },
  }
);

const NavItem = ({ item, isWrapped, isActive, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (item?.children) {
      setIsOpen((prev) => !prev);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isCategory = useMemo(
    () => item?.children && item?.children?.length > 0,
    [item?.children]
  );

  return (
    <li className="flex flex-col">
      <button
        className={cn(
          navItemVariants({
            isWrapped,
            isActive: isActive(item.path),
            isCategory,
          })
        )}
        onClick={handleClick}
      >
        <div className="flex items-center gap-4 flex-1">
          {item.icon && <item.icon className="h-5 w-5" />}
          <p className={cn(isWrapped ? "hidden group-hover:block" : "block")}>
            {item.label}
          </p>
        </div>

        {item.children && (
          <IoChevronDownOutline
            className={cn(
              "w-4 h-4 mr-1 transition-transform",
              isOpen
                ? "-rotate-90 animate-in duration-300"
                : "rotate-0 animate-out duration-300",
              isWrapped && "hidden group-hover:block"
            )}
          />
        )}
      </button>

      {item.children && isOpen && (
        <ul
          className={cn(
            "ml-6 mt-1 flex flex-col gap-1 animate-in fade-in duration-300",
            isWrapped && "ml-0 group-hover:ml-6"
          )}
        >
          {item.children.map((child, idx) => (
            <NavItem
              key={idx}
              item={child}
              isWrapped={isWrapped}
              isActive={isActive}
              navigate={navigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function Sidebar({ className }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isWrapped, setWrapped] = useState(false);
  const navigationList = navigations(PAGE_ROUTES, ["user"]);

  const isActive = (link) => {
    const parentLocation = `/${location.pathname.split("/").at(1).toString()}`;
    return location.pathname === link || parentLocation === link;
  };

  return (
    <aside
      className={cn(
        "hidden lg:block relative group peer",
        isWrapped ? "w-[82px] hover:w-72" : "w-72"
      )}
    >
      <div
        className={cn(
          "fixed h-full border-r border-gray-300 overflow-auto z-40 bg-secondary px-4",
          isWrapped ? "w-[82px] group-hover:w-72" : "w-72",
          className
        )}
      >
        <header className="flex flex-row w-full items-center text-white h-16 mt-2 mb-8">
          <FlexBox className="gap-2 flex-1 pl-2" onClick={() => navigate("/")}>
            <img className="rounded-md h-8 w-8" src="/logo.png" />
            <p
              className={cn(
                "text-xl font-bold leading-9 uppercase tracking-tight text-center text-gray-600 lg:text-start",
                isWrapped ? "hidden group-hover:block" : "block"
              )}
            >
              ScoutJar
            </p>
          </FlexBox>

          <Button
            size="icon"
            className={cn(
              "h-6 w-6 shadow-none rounded-sm bg-transparent text-primary hover:bg-primary/20",
              isWrapped && "hidden group-hover:flex"
            )}
            onClick={() => setWrapped(!isWrapped)}
          >
            <FaAngleLeft
              className={cn(
                "w-4 h-4",
                isWrapped
                  ? "animate-in rotate-180 duration-300"
                  : "animate-out mr-0.5 duration-300"
              )}
            />
          </Button>
        </header>

        <ul className="flex flex-col w-full gap-1 my-4">
          {navigationList.map((item, i) => (
            <NavItem
              key={i}
              item={item}
              isWrapped={isWrapped}
              isActive={isActive}
              navigate={navigate}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}
