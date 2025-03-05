import { AuthLayout } from "@/common/components/layouts";
import { Outlet } from "react-router-dom";
import LoginPage from "@/pages/login";

const AuthRoutes = {
  id: "auth",
  path: "/auth",
  element: <AuthLayout />,
  children: [{ index: true, element: <LoginPage /> }],
};

export default AuthRoutes;
