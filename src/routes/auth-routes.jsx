import { AuthLayout } from "@/common/components/layouts";

import LoginPage from "@/pages/Auth/Login";

const AuthRoutes = {
  id: "auth",
  path: "/auth",
  element: <AuthLayout />,
  children: [{ index: true, element: <LoginPage /> }],
};

export default AuthRoutes;
