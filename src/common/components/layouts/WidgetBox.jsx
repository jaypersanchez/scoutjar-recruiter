import { cn } from "@/common/lib/utils";

export default function WidgetBox({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex rounded-md p-6 border border-primary/10 bg-primary/5 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
