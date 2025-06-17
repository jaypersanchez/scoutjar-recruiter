import * as React from "react";
import { ComponentProps } from "react";
import { cn } from "@/common/lib/utils";

export default function FlexCenter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    />
  );
}
