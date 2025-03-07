import { createBrowserRouter } from "react-router-dom";
import { RootLayout, Page404 } from "@/common/components/layouts";
import AuthRoutes from "./auth-routes";
import PageRoutes from "./page-routes";

const Routes = createBrowserRouter([
  {
    id: "root",
    path: "",
    errorElement: <Page404 />,
    element: <RootLayout />,
    children: [AuthRoutes, PageRoutes],
  },
]);

export default Routes;
