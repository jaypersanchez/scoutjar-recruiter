import { createBrowserRouter } from "react-router-dom";
import { RootLayout, Page404 } from "@/common/components/layouts";
import routes from "./pages/routes";

const Routers = createBrowserRouter(
  [
    {
      id: "root",
      path: "",
      errorElement: <Page404 />,
      element: <RootLayout />,
      children: routes,
    },
  ],
  {
    basename: "/recruiter", 
  }
);

export default Routers;
