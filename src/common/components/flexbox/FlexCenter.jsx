import { forwardRef } from "react";
import { cn } from "@/common/lib/utils";

const FlexCenter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center", className)}
    {...props}
  >
    {children}
  </div>
));

FlexCenter.displayName = "FlexBox";

export default FlexCenter;
