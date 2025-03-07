import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/common/providers";
import Routes from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Routes} />
    </AuthProvider>
  );
}
