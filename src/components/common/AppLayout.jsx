// src/components/common/AppLayout.jsx
import React from "react";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {children}
    </div>
  );
}
