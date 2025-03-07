import { ComponentProps } from "react";
import { cn } from "@/common/lib/utils";

export default function FlexBetween({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  );
}
