import React from "react";
import clsx from "clsx";

/**
 * Hardcoded Lookk Button component (Primary + Secondary)
 */
export default function Button({ variant = "primary", type = "button", children, onClick, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.target.click();
        }
      }}
      className={clsx(
        "inline-flex items-center justify-center font-bold rounded-md text-sm px-6 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-[#6B47DC] text-white hover:bg-[#4f34a6] focus-visible:ring-[#6B47DC]",
        variant === "secondary" && "bg-[#E5D8FF] text-[#233E92] hover:bg-[#d3c4f5] focus-visible:ring-[#6B47DC]",
        className
      )}
    >
      {children}
    </button>
  );
}
