import React from "react";
import { cn } from "@/common/lib/utils";

import { FlexBox } from "@/common/components/flexbox";

export default function PageHeader({ title, className }) {
  return (
    <FlexBox className={cn("gap-3", className)}>
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
    </FlexBox>
  );
}
