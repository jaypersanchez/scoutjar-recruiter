import { PageLayout, Page404 } from "@/common/components/layouts";
import { routers } from "@/common/utils/fnRoutes";
import AUTH_ROUTES from "./AuthRoutes";
import PUBLIC_ROUTES from "./PublicRoutes";

const AUTH_ROUTERS = routers(AUTH_ROUTES);

const routes = [
  ...AUTH_ROUTERS,
  {
    id: "main",
    path: "",
    Component: PageLayout,
    errorElement: <Page404 />,
    children: routers(PUBLIC_ROUTES),
  },
];

export default routes;
