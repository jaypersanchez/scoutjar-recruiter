import { forwardRef } from "react";
import { cn } from "@/common/lib/utils";

const FlexBox = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props}>
    {children}
  </div>
));

FlexBox.displayName = "FlexBox";

export default FlexBox;
