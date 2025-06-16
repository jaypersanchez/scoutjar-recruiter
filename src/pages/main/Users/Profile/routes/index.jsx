import React from "react";
import { Outlet } from "react-router-dom";
import { FlexCol } from "@/common/components/flexbox";

export default function Profile() {
  return (
    <FlexCol className="flex flex-col gap-6">
      <Outlet />
    </FlexCol>
  );
}
