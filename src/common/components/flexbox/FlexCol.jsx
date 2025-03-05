import { forwardRef } from "react";
import { cn } from "@/common/lib/utils";

const FlexCol = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props}>
    {children}
  </div>
));

FlexCol.displayName = "FlexCol";

export default FlexCol;
