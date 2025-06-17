import * as React from "react";
import { cn } from "@/common/lib/utils";

type DividerProps = {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
};

export default function Divider({
  orientation = "horizontal",
  label,
  className,
}: DividerProps) {
  return orientation === "horizontal" ? (
    <div className={cn("relative flex items-center", className)}>
      <div className="flex-grow border-t border-gray-300"></div>
      {label && (
        <span className="px-3 text-gray-400 text-sm uppercase">{label}</span>
      )}
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  ) : (
    <div className={cn("h-full w-px bg-gray-300", className)}></div>
  );
}
