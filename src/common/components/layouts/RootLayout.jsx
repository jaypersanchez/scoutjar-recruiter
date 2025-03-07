import { Outlet } from "react-router-dom";
import { useAuth } from "@/common/hooks";

export default function RootLayout() {
  return <Outlet />;
}
