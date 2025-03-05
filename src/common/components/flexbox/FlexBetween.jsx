import { forwardRef } from "react";
import { cn } from "@/common/lib/utils";

const FlexBetween = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between", className)}
    {...props}
  >
    {children}
  </div>
));

FlexBetween.displayName = "FlexBetween";

export default FlexBetween;
