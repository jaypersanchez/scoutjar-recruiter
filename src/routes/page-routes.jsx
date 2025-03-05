import { PageLayout } from "@/common/components/layouts";
import RecruiterPage from "@/pages/recruiter";
import TalentPage from "@/pages/talent";

const PageRoutes = {
  id: "main",
  path: "/",
  element: <PageLayout />,
  children: [
    {
      index: true,
      element: <RecruiterPage />,
    },
    {
      path: "talent",
      element: <TalentPage />,
    },
  ],
};

export default PageRoutes;
