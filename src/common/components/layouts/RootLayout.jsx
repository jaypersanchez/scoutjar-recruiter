import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/common/providers/AuthProvider.jsx";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
