import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/common/providers";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
