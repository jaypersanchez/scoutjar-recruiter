import React from "react";
import { FlexBox } from "@/common/components/flexbox";
import { PageLayout } from "@/common/components/layouts";
import DashboardCharts from "@/components/DashboardCharts";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import HumanCapitalNews from "@/components/HumanCapitalNews";

export default function DashboardPage() {

  
return (
    <FlexBox className="flex-col gap-4 w-full">
      {/*<DashboardCharts />*/}
      <DashboardAnalytics />
      <HumanCapitalNews />
    </FlexBox>
  );
  //return <FlexBox className="items-start gap-2">This is the Dashboard</FlexBox>;
}

