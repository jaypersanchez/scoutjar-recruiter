import { ComponentProps } from "react";
import { cn } from "@/common/lib/utils";

export default function FlexCol({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn("flex flex-col", className)} {...props} />;
}
