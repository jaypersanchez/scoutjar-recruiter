import { PageRouteProps } from "@/common/types/routes.types";
import { AuthLayout } from "@/common/components/layouts";
import LoginPage from "@/pages/access/Login";

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
    ],
  },
];

export default AUTH_ROUTES;
