import { ComponentProps } from "react";
import { cn } from "@/common/lib/utils";

export default function FlexColCenter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col justify-between", className)}
      {...props}
    />
  );
}
