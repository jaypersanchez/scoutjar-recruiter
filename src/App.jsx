import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/common/providers";
import Routers from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Routers} />
    </AuthProvider>
  );
}
