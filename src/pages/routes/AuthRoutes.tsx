import { PageRouteProps } from "@/common/types/routes.types";
import { AuthLayout } from "@/common/components/layouts";
import LoginPage from "@/pages/access/Login";
import ResetPasswordPage from "@/pages/access/Login/components/ResetPassword"
import ResetPasswordTokenPage from "@/pages/access/Login/components/ResetPasswordToken"

const AUTH_ROUTES: Array<PageRouteProps> = [
  {
    id: "auth",
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
        hidden: false,
      },
      {
        path: "reset-password",
        Component: ResetPasswordPage,
        hidden: true, // not part of menu
      },
      {
        path: "reset-password/:token",
        Component: ResetPasswordTokenPage,
        hidden: true,
      },
    ],
  },
];

export default AUTH_ROUTES;
