import { forwardRef } from "react";
import { cn } from "@/common/lib/utils";

const FlexColCenter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col justify-between", className)}
    {...props}
  >
    {children}
  </div>
));

FlexColCenter.displayName = "FlexColCenter";

export default FlexColCenter;
