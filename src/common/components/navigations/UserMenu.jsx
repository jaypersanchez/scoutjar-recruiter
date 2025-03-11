import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/hooks";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/common/components/ui";
import { FaUserCircle } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";

const menu = [
  {
    label: "Profile",
    link: "/profile",
  },
];

export default function UserMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="ml-auto rounded-full cursor-pointer group outline hover:outline-2 outline-offset-1 outline-primary data-[state=open]:outline-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              <FaUserCircle className="text-primary h-full w-full bg-secondary" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border-1 rounded-md shadow-lg w-52 border-gray-300"
        align="end"
        sideOffset={6}
      >
        <DropdownMenuGroup className="pb-2">
          <DropdownMenuLabel>
            <div className="text-sm font-bold uppercase break-all text-pretty text-primary">
              firstname lastname
            </div>
            <div className="text-xs font-semibold break-all text-pretty text-neutral-400">
              fname.lastname@email.com
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          {menu.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="font-semibold h-9 text-primary focus:text-primary focus:bg-primary/20"
              onSelect={() =>
                location.pathname !== item.link && navigate(item.link)
              }
            >
              <FaUserCircle className="text-primary" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="font-semibold h-9 !text-red-500 focus:bg-red-500/20"
            onSelect={handleLogout}
          >
            <FaPowerOff className="text-red-500" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
