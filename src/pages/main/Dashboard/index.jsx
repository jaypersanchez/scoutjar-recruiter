import React from "react";
import { FlexBox } from "@/common/components/flexbox";
import { PageLayout } from "@/common/components/layouts";

export default function DashboardPage() {
  //return <FlexBox className="items-start gap-2">This is the Dashboard</FlexBox>;
  return (
    <PageLayout>
      <FlexBox className="items-start gap-2">This is the Dashboard</FlexBox>
    </PageLayout>
  );
}
